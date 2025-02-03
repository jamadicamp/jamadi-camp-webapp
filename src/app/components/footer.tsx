import Faq from "./faq";

export default function Footer() {
  return (
    <footer className="bg-orange-50 text-[#3a383a]">
      <div className=" max-w-[800px] mx-auto">
        <Faq />
        <div className="py-12 flex  px-4 md:px-8 ">
          <div className="space-y-8">
            <div className="text-4xl font-bold">Jamadi Camp</div>

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
          </div>
        </div>
      </div>
    </footer>
  );
}
