const Footer = () => {
  return (
    <footer className="bg-zinc-800 text-zinc-300 text-center py-3 sm:py-4">
      <p className="text-sm sm:text-base">
        © {new Date().getFullYear()}, Made with <span role="img" aria-label="heart">❤️</span> by <span className="font-semibold">Manoj Kumar</span>
      </p>
    </footer>
  );
};

export default Footer;
