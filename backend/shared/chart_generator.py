"""
Chart Generator Module
Convert matplotlib charts to Base64 encoding for direct use in HTML <img> tags
This module handles the visualization of nutritional insights data
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import base64
import io


class ChartGenerator:
    """
    ChartGenerator class for creating and encoding nutritional insight visualizations.
    Generates bar charts, heatmaps, and scatter plots from nutritional data.
    """
    
    def __init__(self):
        """
        Initialize the chart generator.
        Set up matplotlib backend for server environment (no display needed).
        """
        # Use 'Agg' backend - suitable for server environments without display
        plt.switch_backend('Agg')
    
    @staticmethod
    def fig_to_base64(fig):
        """
        Convert matplotlib figure to Base64 encoded string.
        Allows the image to be embedded directly in HTML as data URI.
        
        Args:
            fig (matplotlib.figure.Figure): The matplotlib figure object to encode
            
        Returns:
            str: Base64 encoded PNG image string
            
        Example:
            >>> base64_image = ChartGenerator.fig_to_base64(fig)
            >>> html_img = f'<img src="data:image/png;base64,{base64_image}">'
        """
        # Create in-memory buffer for image
        img_buffer = io.BytesIO()
        # Save figure to buffer as PNG
        fig.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
        # Reset buffer position to beginning for reading
        img_buffer.seek(0)
        # Encode buffer content to Base64
        img_base64 = base64.b64encode(img_buffer.read()).decode()
        # Close the figure to free memory
        plt.close(fig)
        return img_base64
    
    def generate_bar_chart(self, avg_macros):
        """
        Generate a bar chart showing average macronutrients by diet type.
        Displays Protein, Carbs, and Fat content for each diet type.
        
        Args:
            avg_macros (pandas.DataFrame): DataFrame with diet types as index 
                                          and columns for Protein(g), Carbs(g), Fat(g)
            
        Returns:
            str: Base64 encoded PNG image of the bar chart
            
        Raises:
            Exception: If chart generation fails
        """
        try:
            # Reshape data for seaborn bar plot
            # Convert wide format (diet types as rows) to long format (for hue)
            avg_long = (
                avg_macros
                .reset_index()
                .melt(id_vars="Diet_type",
                      value_vars=["Protein(g)", "Carbs(g)", "Fat(g)"],
                      var_name="Macronutrient", 
                      value_name="Average (g)")
            )
            
            # Create figure and axis
            fig, ax = plt.subplots(figsize=(12, 6))
            # Plot bar chart with different colors for each macronutrient
            sns.barplot(data=avg_long, 
                       x="Diet_type", 
                       y="Average (g)", 
                       hue="Macronutrient",
                       palette="Set2",
                       ax=ax)
            
            # Configure chart labels and title
            ax.set_title("Average Macronutrients by Diet Type", 
                        fontsize=14, fontweight='bold', pad=20)
            ax.set_ylabel("Average (g)", fontsize=12)
            ax.set_xlabel("Diet Type", fontsize=12)
            ax.legend(title="Macronutrient", title_fontsize=10, fontsize=9)
            
            # Add grid for better readability
            ax.grid(axis='y', alpha=0.3)
            
            # Convert figure to Base64 and return
            return self.fig_to_base64(fig)
            
        except Exception as e:
            raise Exception(f"Error generating bar chart: {str(e)}")
    
    def generate_heatmap(self, avg_macros):
        """
        Generate a heatmap showing macronutrient correlations by diet type.
        Uses color intensity to represent nutrient amounts.
        
        Args:
            avg_macros (pandas.DataFrame): DataFrame with diet types as index 
                                          and macronutrient columns
            
        Returns:
            str: Base64 encoded PNG image of the heatmap
            
        Raises:
            Exception: If heatmap generation fails
        """
        try:
            # Create figure and axis for heatmap
            fig, ax = plt.subplots(figsize=(10, 6))
            
            # Create heatmap with annotations showing values
            sns.heatmap(avg_macros, 
                       annot=True,      # Show cell values
                       fmt='.1f',       # Format to 1 decimal place
                       cmap='YlGnBu',   # Yellow-Green-Blue color scheme
                       cbar_kws={'label': 'Amount (g)'},
                       ax=ax,
                       linewidths=0.5)  # Add lines between cells
            
            # Configure heatmap labels and title
            ax.set_title('Heatmap of Macronutrient Content by Diet Type', 
                        fontsize=14, fontweight='bold', pad=20)
            ax.set_ylabel('Diet Type', fontsize=12)
            ax.set_xlabel('Macronutrient', fontsize=12)
            
            # Convert figure to Base64 and return
            return self.fig_to_base64(fig)
            
        except Exception as e:
            raise Exception(f"Error generating heatmap: {str(e)}")
    
    def generate_scatter_plot(self, top5_protein_recipes):
        """
        Generate a scatter plot of top 5 protein-rich recipes by cuisine and diet type.
        Each point represents a recipe, colored by diet type.
        
        Args:
            top5_protein_recipes (pandas.DataFrame): DataFrame containing top 5 recipes
                                                     with columns: Cuisine_type, Protein(g), Diet_type
            
        Returns:
            str: Base64 encoded PNG image of the scatter plot
            
        Raises:
            Exception: If scatter plot generation fails
        """
        try:
            # Create figure and axis for scatter plot
            fig, ax = plt.subplots(figsize=(13, 7))
            
            # Create scatter plot with multiple visual encodings
            sns.scatterplot(
                data=top5_protein_recipes,
                x='Cuisine_type',      # X-axis: cuisine type
                y='Protein(g)',        # Y-axis: protein content
                hue='Diet_type',       # Color: diet type
                style='Diet_type',     # Marker style: diet type
                s=200,                 # Point size
                alpha=0.7,             # Transparency
                palette="husl",        # Color palette
                ax=ax
            )
            
            # Configure scatter plot labels and title
            ax.set_title('Top 5 Protein-Rich Recipes by Cuisine (per Diet Type)',
                        fontsize=14, fontweight='bold', pad=20)
            ax.set_xlabel('Cuisine Type', fontsize=12)
            ax.set_ylabel('Protein (g)', fontsize=12)
            ax.legend(title="Diet Type", title_fontsize=10, fontsize=9, loc='best')
            
            # Add grid for better readability
            ax.grid(alpha=0.3)
            
            # Rotate x-axis labels for better readability
            ax.tick_params(axis='x', rotation=45)
            
            # Convert figure to Base64 and return
            return self.fig_to_base64(fig)
            
        except Exception as e:
            raise Exception(f"Error generating scatter plot: {str(e)}")

# Test code locally
if __name__ == "__main__":
    """
    Test the ChartGenerator class locally.
    Creates sample data and generates all chart types.
    """
    
    import pandas as pd
    
    # Create sample nutritional data
    sample_data = {
        'Diet_type': ['Vegan', 'Keto', 'Mediterranean', 'Vegan', 'Keto'],
        'Protein(g)': [15.5, 25.3, 18.2, 16.0, 26.1],
        'Carbs(g)': [45.2, 15.8, 48.5, 44.3, 16.2],
        'Fat(g)': [8.2, 18.5, 12.3, 8.5, 19.2],
        'Cuisine_type': ['Asian', 'European', 'Mediterranean', 'Asian', 'European']
    }
    
    # Create DataFrame from sample data
    df = pd.DataFrame(sample_data)
    
    # Initialize chart generator
    gen = ChartGenerator()
    # Calculate average macronutrients by diet type
    avg_macros = df.groupby('Diet_type')[['Protein(g)', 'Carbs(g)', 'Fat(g)']].mean()
    
    # Test chart generation
    print("Generating charts...")
    
    # Generate and test bar chart
    bar_chart = gen.generate_bar_chart(avg_macros)
    print(f"Bar chart Base64 length: {len(bar_chart)}")
    
    # Generate and test heatmap
    heatmap = gen.generate_heatmap(avg_macros)
    print(f"Heatmap Base64 length: {len(heatmap)}")
    
    # Generate and test scatter plot
    top5 = df.sort_values('Protein(g)', ascending=False).head(5)
    scatter = gen.generate_scatter_plot(top5)
    print(f"Scatter plot Base64 length: {len(scatter)}")
    
    print("Charts generated successfully!")