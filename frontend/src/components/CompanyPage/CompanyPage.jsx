import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './CompanyPage.css';

function CompanyPage() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Added for loading state

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/companies`);
                if (response.ok) {
                    const data = await response.json();
                    setCompanies(data);
                } else {
                    console.error('Failed to fetch companies');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false); // Stop loading after fetch is done
            }
        };

        fetchCompanies();
    }, []);

    function cardClick(companyClicked) {
        // Pass the entire company object for more flexibility on the next page
        navigate('/start', { state: { company: companyClicked } });
    }

    if (isLoading) {
        return <div className="loading-screen">LOADING...</div>;
    }

    return (
        <div className="companies-container">
            <h1 className="page-title">{'> SELECT COMPANY'}</h1>
            <div className="company-grid">
                {companies.map((company) => (
                    <div 
                        className="company-card"
                        key={company.id} // Use the unique ID from your data
                        onClick={() => cardClick(company.name)}
                    >
                        {company.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompanyPage;