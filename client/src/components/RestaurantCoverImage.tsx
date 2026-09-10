import React, { useEffect, useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface RestaurantCoverImageProps {
  url?: string;
  alt: string;
  imgSx: SxProps<Theme>;
  placeholderSx: SxProps<Theme>;
  iconFontSize?: number;
  iconOpacity?: number;
}

const RestaurantCoverImage: React.FC<RestaurantCoverImageProps> = ({
  url,
  alt,
  imgSx,
  placeholderSx,
  iconFontSize = 44,
  iconOpacity = 0.8
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  if (!url || hasError) {
    return (
      <Box sx={placeholderSx}>
        <RestaurantIcon sx={{ fontSize: iconFontSize, opacity: iconOpacity }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={url}
      alt={alt}
      onError={() => setHasError(true)}
      sx={imgSx}
    />
  );
};

export default RestaurantCoverImage;
