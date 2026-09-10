package com.example.restaurant.service;

import com.example.restaurant.constants.MessageConstants;
import com.example.restaurant.exception.AccessDeniedException;
import com.example.restaurant.exception.BadRequestException;
import com.example.restaurant.exception.NotFoundException;
import com.example.restaurant.mapper.RestaurantMapper;
import com.example.restaurant.model.enity.Restaurant;
import com.example.restaurant.model.enity.RestaurantImage;
import com.example.restaurant.model.enity.RestaurantWorkingHours;
import com.example.restaurant.model.payload.filter.RestaurantFilter;
import com.example.restaurant.model.payload.request.RestaurantActiveStatusRequest;
import com.example.restaurant.model.payload.request.RestaurantRequest;
import com.example.restaurant.model.payload.request.RestaurantReservationDurationRequest;
import com.example.restaurant.model.payload.request.RestaurantStatusRequest;
import com.example.restaurant.model.payload.request.RestaurantWorkingHoursRequest;
import com.example.restaurant.model.payload.request.WorkingHoursEntryRequest;
import com.example.restaurant.model.payload.response.RestaurantContactResponse;
import com.example.restaurant.model.payload.response.RestaurantDetailsResponse;
import com.example.restaurant.model.payload.response.RestaurantImageResponse;
import com.example.restaurant.model.payload.response.RestaurantResponse;
import com.example.restaurant.repository.CategoryRepository;
import com.example.restaurant.repository.RestaurantImageRepository;
import com.example.restaurant.repository.RestaurantRepository;
import com.example.restaurant.repository.RestaurantWorkingHoursRepository;
import com.example.restaurant.specification.RestaurantSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private static final Map<String, String> ALLOWED_IMAGE_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantWorkingHoursRepository restaurantWorkingHoursRepository;
    private final RestaurantImageRepository restaurantImageRepository;
    private final RestaurantMapper restaurantMapper;
    private final EmployeeService employeeService;

    @Value("${images.upload-dir}")
    private String imagesUploadDir;

    @Value("${images.base-url}")
    private String imagesBaseUrl;

    @Override
    @Transactional
    public RestaurantResponse addRestaurant(RestaurantRequest request) {
        final var restaurant = this.restaurantMapper.mapFromRestaurantRequest(request);

        final var categoryIds = request.categories() == null ? Set.<Long>of() : request.categories();
        final var categories = categoryIds
                .stream()
                .map(id -> this.categoryRepository.findById(id)
                        .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND))
                )
                .collect(Collectors.toSet());

        restaurant.setCategories(categories);

        final var savedRestaurant = this.restaurantRepository.save(restaurant);

        return this.restaurantMapper.mapToRestaurantResponse(savedRestaurant, List.of());
    }

    @Override
    public Page<RestaurantResponse> getRestaurants(RestaurantFilter filter, Pageable pageable) {
        final var specification = RestaurantSpecification.fromFilter(filter)
                .and(RestaurantSpecification.hasIsActive(true));

        final var restaurantsPage = this.restaurantRepository.findAll(specification, pageable);

        return this.mapToRestaurantResponsePage(restaurantsPage);
    }

    @Override
    public Page<RestaurantResponse> getRestaurantsForManage(RestaurantFilter filter, Pageable pageable) {
        final var specification = RestaurantSpecification.fromFilter(filter);

        final var restaurantsPage = this.restaurantRepository.findAll(specification, pageable);

        return this.mapToRestaurantResponsePage(restaurantsPage);
    }

    private Page<RestaurantResponse> mapToRestaurantResponsePage(Page<Restaurant> restaurantsPage) {
        final var restaurantIds = restaurantsPage.getContent().stream()
                .map(Restaurant::getId)
                .toList();

        final var imagesByRestaurantId = this.restaurantImageRepository.findByRestaurantIdIn(restaurantIds)
                .stream()
                .collect(Collectors.groupingBy(image -> image.getRestaurant().getId()));

        return restaurantsPage.map(restaurant -> this.restaurantMapper.mapToRestaurantResponse(
                restaurant,
                this.buildImageResponses(imagesByRestaurantId.getOrDefault(restaurant.getId(), List.of()))
        ));
    }

    @Override
    public RestaurantDetailsResponse getRestaurant(Long id) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse editRestaurant(Long id, RestaurantRequest request) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        if (restaurant.getDeletedAt() != null) {
            throw new BadRequestException(MessageConstants.RESTAURANT_INACTIVE);
        }

        this.restaurantMapper.updateFromRestaurantRequest(request, restaurant);

        final var categoryIds = request.categories() == null ? Set.<Long>of() : request.categories();
        final var categories = categoryIds
                .stream()
                .map(catId -> this.categoryRepository.findById(catId)
                        .orElseThrow(() -> new NotFoundException(MessageConstants.CATEGORY_NOT_FOUND))
                )
                .collect(Collectors.toSet());

        restaurant.setCategories(categories);

        this.restaurantRepository.save(restaurant);

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse updateRestaurantStatus(Long id, RestaurantStatusRequest request) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        restaurant.setIsOpen(request.isOpen());
        this.restaurantRepository.save(restaurant);

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse updateRestaurantActiveStatus(Long id, RestaurantActiveStatusRequest request) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        restaurant.setDeletedAt(request.isActive() ? null : Instant.now());
        this.restaurantRepository.save(restaurant);

        if (!request.isActive()) {
            this.employeeService.invalidateSessionsForRestaurant(id);
        }

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse updateWorkingHours(Long id, RestaurantWorkingHoursRequest request) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var entries = request.workingHours();

        final var distinctDays = entries.stream()
                .map(WorkingHoursEntryRequest::dayOfWeek)
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(DayOfWeek.class)));

        if (entries.size() != 7 || distinctDays.size() != 7) {
            throw new BadRequestException(MessageConstants.INVALID_WORKING_HOURS_DAYS);
        }

        for (final var entry : entries) {
            if (!entry.closed()) {
                if (entry.openTime() == null || entry.closeTime() == null) {
                    throw new BadRequestException(MessageConstants.WORKING_HOURS_TIME_REQUIRED);
                }
                if (!entry.openTime().isBefore(entry.closeTime())) {
                    throw new BadRequestException(MessageConstants.INVALID_WORKING_HOURS_RANGE);
                }
            }
        }

        this.restaurantWorkingHoursRepository.deleteByRestaurantId(id);
        this.restaurantWorkingHoursRepository.flush();

        final var workingHours = entries.stream()
                .map(entry -> {
                    final var workingHoursEntry = new RestaurantWorkingHours();
                    workingHoursEntry.setRestaurant(restaurant);
                    workingHoursEntry.setDayOfWeek(entry.dayOfWeek());
                    workingHoursEntry.setClosed(entry.closed());
                    workingHoursEntry.setOpenTime(entry.closed() ? null : entry.openTime());
                    workingHoursEntry.setCloseTime(entry.closed() ? null : entry.closeTime());
                    return workingHoursEntry;
                })
                .toList();

        this.restaurantWorkingHoursRepository.saveAll(workingHours);

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse updateReservationDuration(Long id, RestaurantReservationDurationRequest request) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        restaurant.setReservationDurationMinutes(request.reservationDurationMinutes());
        this.restaurantRepository.save(restaurant);

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    private RestaurantDetailsResponse buildRestaurantDetailsResponse(Restaurant restaurant) {
        final var workingHours = this.restaurantWorkingHoursRepository.findByRestaurantId(restaurant.getId())
                .stream()
                .sorted(Comparator.comparing(RestaurantWorkingHours::getDayOfWeek))
                .toList();

        final var images = this.buildImageResponses(
                this.restaurantImageRepository.findByRestaurantIdOrderByIdAsc(restaurant.getId())
        );

        return this.restaurantMapper.mapToRestaurantDetailsResponse(restaurant, workingHours, images);
    }

    private List<RestaurantImageResponse> buildImageResponses(List<RestaurantImage> images) {
        return images.stream()
                .map(image -> new RestaurantImageResponse(image.getId(), this.imagesBaseUrl + "/" + image.getFileName()))
                .toList();
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse uploadRestaurantImage(Long id, MultipartFile file) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var extension = ALLOWED_IMAGE_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new BadRequestException(MessageConstants.INVALID_IMAGE_TYPE);
        }

        final var fileName = UUID.randomUUID() + extension;

        try {
            Files.createDirectories(Path.of(this.imagesUploadDir));
            Files.copy(file.getInputStream(), Path.of(this.imagesUploadDir, fileName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store restaurant image", e);
        }

        // Only one image per restaurant is supported for now, so a new upload replaces the existing one.
        final var existingImages = this.restaurantImageRepository.findByRestaurantIdOrderByIdAsc(id);
        existingImages.forEach(existingImage -> this.deleteImageFile(existingImage.getFileName()));
        this.restaurantImageRepository.deleteAll(existingImages);

        final var image = new RestaurantImage();
        image.setRestaurant(restaurant);
        image.setFileName(fileName);
        image.setCreatedAt(Instant.now());
        this.restaurantImageRepository.save(image);

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDetailsResponse deleteRestaurantImage(Long id, Long imageId) {
        final var restaurant = this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));

        final var image = this.restaurantImageRepository.findById(imageId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_IMAGE_NOT_FOUND));

        if (!image.getRestaurant().getId().equals(id)) {
            throw new AccessDeniedException(MessageConstants.ACCESS_DENIED);
        }

        this.deleteImageFile(image.getFileName());
        this.restaurantImageRepository.delete(image);

        return this.buildRestaurantDetailsResponse(restaurant);
    }

    private void deleteImageFile(String fileName) {
        try {
            Files.deleteIfExists(Path.of(this.imagesUploadDir, fileName));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete restaurant image file", e);
        }
    }

    @Override
    public List<RestaurantContactResponse> getRestaurantsContact(List<Long> restaurantIds) {
        return this.restaurantRepository.findAllById(restaurantIds)
                .stream()
                .map(this.restaurantMapper::mapToRestaurantContactResponse)
                .toList();
    }

    @Override
    public void restaurantExists(Long id) {
        this.restaurantRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MessageConstants.RESTAURANT_NOT_FOUND));
    }

    @Override
    public List<Long> searchRestaurantIds(String name) {
        if (!StringUtils.hasText(name)) {
            return List.of();
        }

        return this.restaurantRepository.findAll(RestaurantSpecification.hasNameContaining(name))
                .stream()
                .map(Restaurant::getId)
                .toList();
    }

    @Override
    public void validateWithinWorkingHours(Long restaurantId, Instant dateTime) {
        final var workingHours = this.restaurantWorkingHoursRepository.findByRestaurantId(restaurantId);

        if (workingHours.isEmpty()) {
            return;
        }

        final var zonedDateTime = dateTime.atZone(ZoneId.systemDefault());
        final var dayOfWeek = zonedDateTime.getDayOfWeek();
        final var localTime = zonedDateTime.toLocalTime();

        final var entry = workingHours.stream()
                .filter(workingHoursEntry -> workingHoursEntry.getDayOfWeek() == dayOfWeek)
                .findFirst()
                .orElse(null);

        if (entry == null) {
            return;
        }

        if (
                entry.getClosed()
                || localTime.isBefore(entry.getOpenTime())
                || localTime.isAfter(entry.getCloseTime())
        ) {
            throw new BadRequestException(MessageConstants.OUTSIDE_WORKING_HOURS);
        }
    }
}