import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface CardProps extends TouchableOpacityProps {
  id: string,
  children: React.ReactNode;
  className?: string;
}

export const Card = ({item: {children, id, className = "", ...props }} : {item : CardProps}) => {
  return (
    <TouchableOpacity 
      className={`bg-light-surface-elevated dark:bg-dark-surface-elevated rounded-2xl shadow-xl m-2 p-4 border border-light-outline-default dark:border-dark-outline-default flex justify-end ${className}`}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};