import { motion } from 'framer-motion';
import MultiLayerCard from './MultiLayerCard';

const PremiumTable = ({ recipes }) => {
  return (
    <MultiLayerCard>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th className="table-header">Recipe Name</th>
              <th className="table-header">Diet Type</th>
              <th className="table-header">Cuisine</th>
              <th className="table-header text-right">Protein (g)</th>
              <th className="table-header text-right">Carbs (g)</th>
              <th className="table-header text-right">Fat (g)</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <motion.tr
                  key={index}
                  className="table-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="table-cell">{recipe.Recipe_name}</td>
                  <td className="table-cell">
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(66, 133, 244, 0.15)',
                      color: 'rgba(66, 133, 244, 0.95)',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: '1px solid rgba(66, 133, 244, 0.2)'
                    }}>
                      {recipe.Diet_type}
                    </span>
                  </td>
                  <td className="table-cell-secondary">{recipe.Cuisine_type}</td>
                  <td className="table-cell-number text-right">{recipe['Protein(g)'].toFixed(1)}</td>
                  <td className="table-cell-secondary text-right">{recipe['Carbs(g)'].toFixed(1)}</td>
                  <td className="table-cell-secondary text-right">{recipe['Fat(g)'].toFixed(1)}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  No recipes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-header {
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-cell {
          padding: 1rem 1.5rem;
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .table-cell-secondary {
          padding: 1rem 1.5rem;
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .table-cell-number {
          padding: 1rem 1.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </MultiLayerCard>
  );
};

export default PremiumTable;