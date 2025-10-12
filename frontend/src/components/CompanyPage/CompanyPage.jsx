import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
// import './CompanyPage.css'

function CompanyPage() {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    
    useEffect(() => {
        // Define an async function inside the effect
        const fetchCompanies = async () => {
            try {
              const response = await fetch(`http://localhost:8000/api/companies`, {
                method: 'GET',
              });
              // console.log(response);
              if (response.ok) {
                const data = await response.json();
                console.log(data)
                setCompanies(data);
              } else {
                console.error('Failed to fetch companies');
              }
          } catch (error) {
            console.error('Error:', error);
          }
        };

        fetchCompanies();
    }, []);
    
    // Takes the user to the start page
    function cardClick(companyClicked) {
      console.log(companyClicked)
      // navigate('/start');
    }

    // function cardClick() {
    //     console.log("Hello World!")
    // }

    return (
      <div className="companies-container">
        {companies.map((company, idx) => {
          return (
            <div className="company"
                key={idx}
                onClick={() => cardClick(company.name)}
            >
              {company.name}
            </div>
            );
          }
        )}
      </div>
    )
}

export default CompanyPage;
