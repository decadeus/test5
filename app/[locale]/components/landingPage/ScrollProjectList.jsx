import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import useCustomCursor from "./useCustomCursor";
import Statistics from "./Statistics";

export default function ScrollProjectList({
  projects,
  t,
  uniqueCompanies,
  uniqueIdeas,
  totalApartments,
}) {
  const {
    showCursor,
    setShowCursor,
    cursorLink,
    setCursorLink,
    CursorComponent,
  } = useCustomCursor(t("EnSavoirPlus"));

  return (
    <div className="flex flex-col justify-center mx-auto w-[350px] sm:w-[550px] md:w-[700px] lg:w-[950px] xl:w-[1100px] overflow-x-auto relative pt-24">
      <h2 className="font-macondo text-black text-4xl">{t("TitleNew")}</h2>

      <ScrollArea.Root className="ScrollAreaRoot" type="always">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-8 mb-4 ml-4">
            {projects.map((item) => (
              <div
                key={item.id}
                className="flex flex-col w-[250px] sm:w-[200px] md:w-[250px] lg:w-[350px] xl:w-[450px] gap-4 mt-4 shadow-lg p-4 rounded-sm bg-white transition-shadow duration-1000 hover:shadow-xl hover:shadow-slate-950"
                onMouseEnter={() => {
                  setShowCursor(true);
                  setCursorLink(item.link);
                }}
                onMouseLeave={() => {
                  setShowCursor(false);
                  setCursorLink("");
                }}
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-[150px] sm:h-24 md:h-28 lg:h-[200px] xl:h-80">
                    <Avatar
                      url={item.mainpic_url}
                      width={270}
                      height={196}
                      className="rounded-sm"
                      alt={item.name}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700 font-satisfy font-extrabold text-2xl sm:text-lg lg:text-3xl">
                      {item.name}
                    </p>
                    <p className="text-gray-700 text-[12px] sm:text-[12px] md:text-md">
                      {item.adresse}
                    </p>
                    <p className="text-gray-700 text-[12px]">
                      {item.city}, {item.country}
                    </p>
                    {item.des && (
                      <p className="text-gray-700 text-sm pt-4">
                        {item.des.length > 300
                          ? item.des.substring(0, 300) + "..."
                          : item.des}
                      </p>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="ScrollAreaScrollbar"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="ScrollAreaCorner" />
      </ScrollArea.Root>

      {showCursor && (
        <div className="hidden sm:block">
          <CursorComponent />
        </div>
      )}

      <div className="flex justify-center mt-12">
        <Statistics
          uniqueCompanies={uniqueCompanies}
          uniqueIdeas={uniqueIdeas}
          totalApartments={totalApartments}
        />
      </div>
    </div>
  );
}
