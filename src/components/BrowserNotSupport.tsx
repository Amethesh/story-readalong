import { Chrome, Compass, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const BrowserNotSupport = () => {
  return (
    <div className="absolute z-50 top-0  grid h-screen w-screen place-items-center backdrop-blur-sm">
      <Card className="relative z-50 w-[350px] bg-[#e9f3f4] border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Your browser is not supported 🥲</CardTitle>
          <CardDescription>Please use that latest version of these browser</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="my-2 text-lg font-semibold grid grid-cols-2 gap-2">
            <li className="list-none flex items-center justify-center gap-2 bg-[#289197] p-1 text-[#e9f3f4] rounded-full">
              <Chrome />
              Chrome
            </li>
            <li className="list-none flex items-center justify-center gap-2 bg-[#289197] p-1 text-[#e9f3f4] rounded-full">
              <Globe />
              Edge
            </li>
            <li className="list-none flex items-center justify-center gap-2 bg-[#289197] p-1 text-[#e9f3f4] rounded-full">
              <Compass />
              Safari
            </li>
          </p>
        </CardContent>
        <CardFooter className="w-full">
          <a
            className="w-full"
            href="https://www.google.com/chrome/?brand=CHBD&brand=WHAR&gad_source=1&gclid=EAIaIQobChMIo6-G7u7fhQMVZqlmAh3zPgUHEAAYASABEgICp_D_BwE&gclsrc=aw.ds"
          >
            <Button variant={"secondary"} className="w-full">
              Install chrome
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BrowserNotSupport;
