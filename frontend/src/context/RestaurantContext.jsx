import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInfo = async () => {
        try {
            const data = await api.getRestaurantInfo();
            setRestaurantInfo(data);
        } catch (error) {
            console.error('Failed to fetch restaurant info:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <RestaurantContext.Provider value={{ restaurantInfo, setRestaurantInfo, loading, refreshInfo: fetchInfo }}>
            {children}
        </RestaurantContext.Provider>
    );
};

export const useRestaurant = () => {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
};
