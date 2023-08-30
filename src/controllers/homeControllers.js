
const renderHome = async (req, res) => {
    try {
      res.render("home");
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  };

  export {renderHome}








