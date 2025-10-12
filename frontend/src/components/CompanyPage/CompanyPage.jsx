// CompanyPage.jsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

const CompanyPage = () => {
  // State to hold the list of companies
  const [companies, setCompanies] = useState([]);
  // State to manage the loading indicator
  const [isLoading, setIsLoading] = useState(true);
  // State to store any potential errors
  const [error, setError] = useState(null);

  /**
   * Fetches the list of companies from the API when the component mounts.
   */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/companies`);
        if (!response.ok) {
          // Throw an error if the server response is not successful
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCompanies(data); // Set the fetched companies into state
      } catch (e) {
        console.error("Failed to fetch companies:", e);
        setError("Couldn't load company data. Please check your connection and try again.");
      } finally {
        // Hide the loading indicator regardless of success or failure
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  /**
   * Handles the press event for a company button.
   * @param {string} companyName - The name of the company that was pressed.
   */
  const handlePressCompany = (companyName) => {
    console.log(`Selected company: ${companyName}`);
    // You can replace this with navigation or other logic, e.g.:
    // navigation.navigate('CompanyDetails', { company: companyName });
    Alert.alert("Company Selected", `You have selected ${companyName}.`);
  };
  
  // Display a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Companies...</Text>
      </View>
    );
  }

  // Display an error message if the fetch failed
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select a Company</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {companies.map((company) => (
          <View style={styles.buttonContainer} key={company}>
            <Button
              title={company}
              onPress={() => handlePressCompany(company)}
              color="#007AFF"
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonContainer: {
    marginVertical: 8, // Adds space between buttons
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
});

export default CompanyPage;