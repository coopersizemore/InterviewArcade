import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './CategoryPage.css';

function CategoryPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Added for loading state

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false); // Stop loading after fetch is done
            }
        };

        fetchCategories();
    }, []);

    function cardClick(categoryName) {
        navigate('/start', { state: { category: categoryName } });
    }

    if (isLoading) {
        return <div className="loading-screen">LOADING...</div>;
    }

    return (
        <div className="categories-container">
            <h1 className="page-title">{'> SELECT CATEGORY'}</h1>
            <div className="category-grid">
                {categories.map((category) => (
                    <div 
                        className="category-card"
                        key={category.id} // Use the unique ID from your data
                        onClick={() => cardClick(category.name)}
                    >
                        {category.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryPage;