'use client';

import React from 'react';

type LazyLoadImageProps = {
  alt: string;
  height?: number;
  src: string;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
};

export const LazyLoadImage = ({
  alt,
  height,
  src,
  width,
  className,
  style,
  wrapperClassName: _wrapperClassName,
}: LazyLoadImageProps) => (
  <img
    className={className}
    alt={alt}
    height={height}
    loading="lazy"
    src={src}
    width={width}
    style={style}
  />
);
