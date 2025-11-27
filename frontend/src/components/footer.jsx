function Footer() {
  const iso = new Date().toISOString();
  const year = new Date(iso).getFullYear();

  return (
    <footer className="p-4 bg-black text-neutral-600 flex justify-between items-center h-20">
      <div className="">
        <p className="text-sm">All rights reserved Lika &copy; {year}</p>
      </div>
      <div>
        <img
          className="w-20 sm:w-28 p-4"
          src="../../public/lika-logo.png"
          alt="Lika logo"
        />
      </div>
      <div className="flex gap-2 sm:gap-6 text-sm">
        <p>Contact</p> <p className="text-center sm:text-start">About us</p>
      </div>
    </footer>
  );
}

export default Footer;
