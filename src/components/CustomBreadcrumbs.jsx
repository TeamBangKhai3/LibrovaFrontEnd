// src/components/CustomBreadcrumbs.jsx
import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CustomBreadcrumbs = ({ links, current, sx, disabledLinks = [] }) => {
    const navigate = useNavigate();

    const handleClick = (event, path) => {
        event.preventDefault();
        navigate(path);
    };

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={sx}>
            {links.map((link, index) => (
                disabledLinks.includes(link.label) ? (
                    <Typography key={index} color="text.primary">
                        {link.label}
                    </Typography>
                ) : (
                    <Link
                        key={index}
                        underline="hover"
                        color="inherit"
                        href={link.path}
                        onClick={(event) => handleClick(event, link.path)}
                    >
                        {link.label}
                    </Link>
                )
            ))}
            <Typography color="text.primary"> {current} /</Typography>
        </Breadcrumbs>
    );
};

export default CustomBreadcrumbs;