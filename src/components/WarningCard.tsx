import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
interface WarningCardProps{
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}
const WarningCard = ({setShowDialog}:WarningCardProps) => {
  return (
    <Card className="relative z-50 w-[450px]">
      <CardHeader>
        <CardTitle>Warning!</CardTitle>
        {/* <CardDescription>
          All the features including creating an dediting questions and cover letter
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <p className="my-4 text-xl font-semibold">
          <span className="text-[40px] font-bold">Please read slowly and clearly!</span>
        </p>
      </CardContent>
      <CardFooter className="w-full">
        <Button
          variant={"default"}
          className="w-full"
          onClick={()=>setShowDialog(false)}
        >
          Retry this page
        </Button>
      </CardFooter>
    </Card>
  )
}

export default WarningCard