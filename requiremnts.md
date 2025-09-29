
Listen
Introduction
In this project, you will design and develop a cloud-native application that processes and analyzes the All_Diets.csv dataset using Azure cloud services. The focus is on extracting nutritional insights related to macronutrient content (protein, carbs, fat) for various diet types and cuisines, with the data stored in a NoSQL database such as Cosmos DB (Azure). You will also explore serverless architecture, cloud storage, and CI/CD pipelines for automating deployments, ensuring scalability and efficiency throughout the development process.
By the end of the project, you'll gain experience in processing large datasets, performing nutritional analysis, and automating deployments with cloud-native technologies.
Prerequisites
Begin Project 1 while working on Lab 1 and Lab 2.
Lab 1 and Lab 2, along with their prerequisites, are designed to build your understanding of key concepts and the Azure Sandbox environment. These labs provide preconfigured Ubuntu VM with Python, Docker, essential Python packages (Pandas, Matplotlib, Seaborn), and Visual Studio Code for development. Additional simulation tools will be introduced in relevant tasks.
You are expected to start Project 1 during your work on these labs and complete the project after finishing both Lab 1 and Lab 2.
Review Units 1 and 2 to reinforce foundational knowledge and support your project work.
All_Diets.csv Dataset Overview
The All_Diets.csv dataset contains recipes from various diets and cuisines, with essential nutritional information for each recipe, such as protein, carbs, and fat. The dataset can be downloaded from the Kaggle or from the Course Resources.
Columns in the dataset:
Diet_type: Type of diet (e.g., Vegan, Keto, Mediterranean).
Recipe_name: Name of the recipe.
Cuisine_type: Cuisine the recipe belongs to (e.g., Italian, Mexican, Indian).
Protein (g): Amount of protein in grams.
Carbs (g): Amount of carbohydrates in grams.
Fat (g): Amount of fat in grams.
Extraction_day: The day the recipe was extracted.
Sample data of our dataset:
Diet_type
Recipe_name
Cuisine_type
Protein(g)
Carbs(g)
Fat(g)
Extraction_day
Extraction_time
Paleo
Bone Broth From 'Nom Nom Paleo'
american
5.22
1.29
3.2
10/16/2022
17:20:09
Paleo
Paleo Effect Asian-Glazed Pork Sides, A Sweet & Crispy Appetizer
south east Asian
181.55
28.62
146.14
10/16/2022
17:20:09
Paleo
Paleo Pumpkin Pie
american
30.91
302.59
96.76
10/16/2022
17:20:09
Paleo
Strawberry Guacamole recipes
mexican
9.62
75.78
59.89
10/16/2022
17:20:09
Paleo
Asian Cauliflower Fried "Rice" From 'Nom Nom Paleo'
chinese
39.84
54.08
71.55
10/16/2022
17:20:09
paleo
Paleo Shrimp-Stuffed Mushrooms recipes
Mediterranean
68.62
34.15
42.44
10/16/2022
17:20:09
Paleo
Paleo Pumpkin Pie recipes
american
30.03
275.88
97.68
10/16/2022
17:20:09
Paleo
Autoimmune Paleo Pesto
italian
4.25
14.15
72.9
10/16/2022
17:20:09
Paleo
Baked Banana Chip Encrusted French Toast
French
152.88
1874.52
385.8
10/16/2022
17:20:09
Paleo
Vietnamese Pho Pressure Cooker (Noodle Soup)
south east Asian
602.91
274.87
400.01
10/16/2022
17:20:09
Paleo
Paleo Collard Burrito
mexican
44.62
28.66
78.46
10/16/2022
17:20:09
…
…
…
…
…
…
…
…
 
Tasks and Instructions
Task 1: Dataset Analysis and Insights
Analyze the dataset to calculate and visualize key nutritional statistics and insights.
Instructions:
Data processing with Python in Ubuntu VM; specifically using Python's Pandas library to process and analyze the dataset. You can download and install Visual Studio Code and add the necessary libraries/packages for this task:
Calculate the average macronutrient content (protein, carbs, fat) for each diet type.
Identify the top 5 protein-rich recipes for each diet type.
Find the diet type with the highest protein content across all recipes.
Identify the most common cuisines for each diet type.
Create new metrics by computing the protein-to-carbs ratio and the carbs-to-fat ratio for each recipe.
Clean the data by handling missing values (e.g., null entries in protein, carbs, or fat).
Python pseudocode:
import pandas as pd
# Load the dataset
df = pd.read_csv('path_to_csv')
# Handle missing data (fill missing values with mean)
df.fillna(df.mean(), inplace=True)
# Calculate the average macronutrient content for each diet type
avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
# Find the top 5 protein-rich recipes for each diet type
top_protein = df.sort_values('Protein(g)', ascending=False).groupby('Diet_type').head(5)
# Add new metrics (Protein-to-Carbs ratio and Carbs-to-Fat ratio)
df['Protein_to_Carbs_ratio'] = df['Protein(g)'] / df['Carbs(g)']
df['Carbs_to_Fat_ratio'] = df['Carbs(g)'] / df['Fat(g)']
Use Matplotlib or Seaborn python packages to visualize the results of your analysis:
Bar charts to display the average macronutrient content (Protein, Carbs, Fat) for each diet type.
Heatmaps to show the relationship between macronutrient content and diet types.
Scatter plots to display the top 5 protein-rich recipes and their distribution across different cuisines.
Visualization pseudocode:
import seaborn as sns
import matplotlib.pyplot as plt
# Bar chart for average macronutrients
sns.barplot(x=avg_macros.index, y=avg_macros['Protein(g)'])
plt.title('Average Protein by Diet Type')
plt.ylabel('Average Protein (g)')
plt.show()
Deliverables:
Python script: data_analysis.py
Visualizations: Screenshots or embedded images of your bar charts, heatmaps, and scatter plots.
Screenshots with date and time visible to capture data processing, calculations and visualizations in Python.
 
      
Task 2: Dockerizing the Data Processing Application
Containerize your data processing application using Docker and simulate deployment locally without relying on real Azure resources.
Instructions:
Write a Dockerfile to containerize your Python application, ensuring consistent environments across different deployments. Use the following example as a starting point:
FROM python:3.9-slim
WORKDIR /app
COPY . /app
RUN pip install pandas matplotlib seaborn
CMD ["python", "data_analysis.py"]
Build the Docker image locally:
docker build -t diet-analysis .
Test the Docker image locally by running the container and verifying that your data processing works correctly inside the container:
docker run -it diet-analysis
Push the Docker image to a container registry (optional for simulation):
Instead of pushing to Azure Container Registry, you can:
Use Docker Hub (a free, public container registry), or
Use a local container registry simulation (e.g., Harbor) if you want to practice push/pull workflows locally.
Steps for Docker Hub:
docker login
docker tag diet-analysis yourdockerhubusername/diet-analysis
docker push yourdockerhubusername/diet-analysis
Simulate deployment of the Docker container locally or with orchestration tools:
Run the container locally as in step 3 to simulate deployment.
Use Docker Compose or Kubernetes Minikube to mimic container orchestration and deployment.
Deliverables:
Dockerfile.
Screenshots with date and time visible demonstrating:
Docker containers run locally and process data.
Docker image pushed to Docker Hub or local registry.
Docker container deployment simulated via Docker Compose or Minikube.
 
 
 
Task 3: Cloud-Native Data Processing with Serverless Functions
In Ubuntu VM, implement a simulated serverless function to process the All_Diets.csv dataset, calculate insights, and store the results in a simulated NoSQL database, using Azurite[1] as your local Blob Storage emulator instead of real Azure resources. How to use Azurite while developing your Azure Function locally. This task builds on the Dockerized data processing application from Task 2 by moving processing logic into a serverless function environment simulated locally.

Instructions:
Set up Azurite to simulate Azure Blob Storage locally:
Install Azurite in Ubuntu VM via npm or Docker:
npm: npm install -g azurite. Azurite npm GitHub repo
Docker: docker run -p 10000:10000 -p 10001:10001 mcr.microsoft.com/azure-storage/azurite
Azurite Docker Hub
Start Azurite to run the Blob Storage emulator on your local Ubuntu VM.
Use Azure Storage Explorer configured for Azurite to upload your All_Diets.csv file to the local Blob container.
Azurite default Blob service endpoint: http://127.0.0.1:10000/devstoreaccount1
Create and run the simulated serverless function locally:
Use Azure Functions Core Tools or a Python script to simulate the function that:
Reads the CSV file from the Azurite Blob Storage emulator using Azure Blob Storage SDK configured to point to Azurite.
Calculates average protein, carbs, and fat content per diet type.
Stores the results in a simulated NoSQL database (e.g., local MongoDB or JSON file).
Sample Python snippet to read CSV from Azurite Blob Storage:
             from azure.storage.blob import BlobServiceClient
import pandas as pd
import io
import json
 
def process_nutritional_data_from_azurite():
    connect_str = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;" \
                  "AccountKey=Eby8vdM02xNOcqFeqCnrC4xF..." \
                     "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
 
    container_name = 'datasets'
    blob_name = 'All_Diets.csv'
 
    container_client = blob_service_client.get_container_client(container_name)
    blob_client = container_client.get_blob_client(blob_name)
 
    # Download blob content to bytes
    stream = blob_client.download_blob().readall()
    df = pd.read_csv(io.BytesIO(stream))
 
    # Calculate averages
    avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
 
    # Save results locally as JSON (simulate NoSQL storage)
    result = avg_macros.reset_index().to_dict(orient='records')
    with open('simulated_nosql/results.json', 'w') as f:
        json.dump(result, f)
 
    return "Data processed and stored successfully."
# Run the function
print(process_nutritional_data_from_azurite())
Since Azurite does not support real event triggers, manually invoke the function after uploading the file, or use a file watcher tool such as watchdog (Python package) to simulate event-driven invocation.
Deliverables:
Serverless function code (e.g., lambda_function.py or equivalent script) demonstrating Azure Blob Storage access via Azurite.
Screenshots with date and time visible showing:
Azurite Blob Storage running and the All_Diets.csv uploaded.
Function running locally and processing data from Azurite.
Results saved in your simulated NoSQL storage (JSON file, MongoDB, etc.).
Explanation of how you simulated cloud storage with Azurite and the serverless processing workflow.
 
 
 
Task 4: Set up CI/CD pipeline
Automate the deployment of your simulated serverless function or containerized application using a CI/CD pipeline with GitHub Actions, without relying on real Azure or cloud infrastructure.
This task connects to the previous ones where you used Azurite for Blob Storage simulation and local serverless function or Docker container execution.
Instructions:
Create a GitHub repository to store your code (e.g., Python serverless function, Dockerfile, scripts).
Helps manage version control and track changes.
How to create a GitHub repository
Configure GitHub Actions to automate your workflow. Your CI/CD pipeline will:
Build your Docker image (if using Docker).
Run tests or checks on your Python code.
Push the image to a Docker registry (local or Docker Hub).
Optionally, trigger deployment scripts on your local simulation environment via SSH.
For example workflows to help you create your pipeline, see the official GitHub Actions workflow examples repository: GitHub Actions Workflow Examples
Commit and push your updates:
git add .
git commit -m "Setup CI/CD pipeline simulation"
git push origin main
Monitor the pipeline in GitHub Actions and confirm build/test success.
Deliverables:
CI/CD config file: .github/workflows/deploy.yml
Screenshots of GitHub Actions with date and time visible run logs showing successful build/test
Evidence of simulated deployment (e.g., running container output)
 
  
 
Task 5: Search for Enhancement
Select two of the following enhancement options to research and apply improvements to any one of the previous tasks (Tasks 1–4):
Explore multi-stage Docker builds or other techniques to create smaller, more efficient container images. This can reduce deployment time and resource usage.
Investigate ways to reduce cold start latency and enhance execution speed in serverless functions (e.g., Azure Functions or local simulation alternatives).
Focus on optimizing database queries, indexing, or data processing logic to speed up data handling and reduce computing costs.
Deliverable:
A 1-page report explaining:
Which two options do you choose?
What research you conducted
The improvements you applied
The impact or expected benefits
 
 
 
Marking Criteria (100 marks)
Task
Description
Marks
Task 1: Dataset Analysis & Insights
- Data processing using Python (Pandas)
- Calculation of averages, ratios
- Visualizations (bar charts, heatmaps, scatter plots)
20
Task 2: Dockerizing the Data Processing
- Dockerfile correctness
- Local container build and run
- Optional image push to Docker Hub or local registry
- Simulated deployment with Docker Compose or Minikube
20
Task 3: Serverless Data Processing (Azurite Simulation)
- Azure Blob Storage simulation setup with Azurite
- Serverless function to process data and save results
- Local NoSQL simulated storage usage
20
Task 4: CI/CD Pipeline with GitHub Actions
- GitHub repo creation and version control
- CI/CD workflow automating build, test, push
- Evidence of pipeline success and simulated deployment
20
Task 5: Enhancement Research & Implementation
- Select and research two enhancements
- Document improvements and expected impact clearly in a concise report
5
Video Presentation
- Clear presentation by all team members
- Covers project parts logically and confidently
10
Contribution Report
- Detailed individual contributions
- GitHub activity and collaboration evidence
- Task division and communication logs
5
 
Submission Requirements
To successfully submit your project, please zip and submit the following files and materials together:
Code Files:
data_analysis.py — Python script for data processing and analysis.
lambda_function.py — Python script for your serverless function (simulated Azure Function).
Dockerfile — Dockerfile used to containerize your application.
.github/workflows/deploy.yml — CI/CD pipeline configuration for automated deployment using GitHub Actions.
PDF Report:
Include all necessary screenshots demonstrating your work (e.g., outputs, deployments, logs).
Include the 1-page enhancement report with your research and applied improvements.
Ensure the document displays the date and time in designated areas.
Save or convert the file to PDF format before submission.
Team Video Presentation:
Submit a video where all team members present their respective parts of the project.
Make sure each team member’s face is clearly visible during their presentation.
Use MS Teams or a similar tool to record the video.
Contribution Report: Provide a detailed breakdown of each team member’s contributions, including:
Specific tasks and steps completed.
GitHub activities such as commits made, pull requests submitted and reviewed.
Meeting attendance records.
Hours spent working on the project.
Agreements on task distribution and responsibilities.
Communication methods used and frequency of interactions (e.g., weekly meetings, GitHub Issues, email).

[1] You can install it via npm, Docker and VS Code extension.