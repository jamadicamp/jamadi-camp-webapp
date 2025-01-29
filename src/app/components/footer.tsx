export default function Footer() {
  return (
    <footer className="bg-[#020f06] mt-8 text-white py-32 flex flex-col items-center justify-center">
      <div className="text-lg space-y-2">
        <h3 className="text-2xl">Contact</h3>
        <div>
          <a href="tel:+19999999999" className="opacity-80">
            Whatsapp: +1 999 999 9999
          </a>
        </div>
        <div>
          {" "}
          <a href="mailto:jamadicamp@gmail.com" className="opacity-80">
            Email: jamadicamp@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
