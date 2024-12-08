// src/components/CustomBreadcrumbs.jsx
import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/providers/theme-provider';

const CustomBreadcrumbs = ({ links, current, sx, disabledLinks = [] }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleClick = (event, path) => {
        event.preventDefault();
        navigate(path);
    };

    return (
        <Breadcrumbs 
            aria-label="breadcrumb" 
            sx={{ 
                ...sx,
                '& .MuiBreadcrumbs-separator': {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                },
                '& .MuiBreadcrumbs-li': {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'inherit'
                }
            }}
        >
            {links.map((link, index) => (
                disabledLinks.includes(link.label) ? (
                    <Typography 
                        key={index} 
                        sx={{ 
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'text.primary'
                        }}
                    >
                        {link.label}
                    </Typography>
                ) : (
                    <Link
                        key={index}
                        underline="hover"
                        sx={{ 
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'inherit',
                            '&:hover': {
                                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'inherit'
                            }
                        }}
                        href={link.path}
                        onClick={(event) => handleClick(event, link.path)}
                    >
                        {link.label}
                    </Link>
                )
            ))}
            <Typography 
                sx={{ 
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'text.primary'
                }}
            >
                {current} /
            </Typography>
        </Breadcrumbs>
    );
};

export default CustomBreadcrumbs;