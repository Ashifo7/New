import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  interactive = false,
  hover = false,
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        'bg-gray-800 rounded-2xl shadow-soft border border-primary-600/20 overflow-hidden transition-all duration-300 ease-out',
        interactive && 'hover:shadow-large hover:-translate-y-1 cursor-pointer',
        hover && 'hover:shadow-medium hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '', 
  gradient = false,
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        'px-6 py-5 border-b border-primary-600/20 text-gray-100',
        gradient 
          ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
          : 'bg-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardBody = ({ 
  children, 
  className = '', 
  padding = 'normal',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-3',
    normal: 'px-6 py-5',
    lg: 'px-8 py-6',
  };
  
  return (
    <div 
      className={clsx(paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        'px-6 py-4 bg-gray-900/50 border-t border-primary-600/20 text-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;