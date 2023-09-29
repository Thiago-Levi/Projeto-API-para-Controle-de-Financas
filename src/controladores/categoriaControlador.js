const pool = require("../conexao");

const listar = async (req, res) => {
  try {
    const querySelectCategorias = `
      select * from categorias
    `;
    const { rows } = await pool.query(querySelectCategorias);

    return res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { listar };
