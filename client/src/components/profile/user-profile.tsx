import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";

interface UserProfileProps {
  userData: any;
}

export default function UserProfile({ userData }: UserProfileProps) {
  if (!userData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-muted"></div>
              <div className="ml-4 space-y-2">
                <div className="h-5 w-32 bg-muted rounded"></div>
                <div className="h-4 w-48 bg-muted rounded"></div>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="h-4 w-32 bg-muted rounded mb-3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-muted rounded"></div>
                  <div className="h-4 w-8 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-muted rounded"></div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert height from cm to feet/inches
  const heightInFeet = userData.height ? Math.floor(userData.height / 30.48) : 0;
  const heightInInches = userData.height ? Math.round((userData.height % 30.48) / 2.54) : 0;
  const formattedHeight = userData.height ? `${heightInFeet}'${heightInInches}"` : "--";
  
  // Convert weight from kg to lbs
  const weightInLbs = userData.weight ? Math.round(userData.weight * 2.20462) : "--";
  const targetWeightInLbs = userData.targetWeight ? Math.round(userData.targetWeight * 2.20462) : "--";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Profile" />
            <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h3 className="text-lg font-semibold font-inter">{userData.name || "User"}</h3>
            <p className="text-sm text-muted-foreground font-nunito">{userData.email}</p>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 font-nunito">Your Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Age</p>
              <p className="font-medium">{userData.age || "--"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Height</p>
              <p className="font-medium">{formattedHeight}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Goal</p>
              <p className="font-medium">{userData.fitnessGoal || "--"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Target</p>
              <p className="font-medium">{targetWeightInLbs} lbs</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Link href="/profile">
            <Button variant="secondary" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
