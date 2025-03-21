import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import UserProfile from "@/components/profile/user-profile";
import MetricsForm from "@/components/profile/metrics-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Default userId for demo purposes (this would typically come from auth)
const DEFAULT_USER_ID = 1;

export default function Profile() {
  const { toast } = useToast();

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['/api/user/1'],
    staleTime: 5 * 60 * 1000, // 5 min stale time
  });

  if (error) {
    toast({
      title: "Error loading user data",
      description: "Please try refreshing the page.",
      variant: "destructive",
    });
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-3/4 bg-gray-200 rounded-md mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-standard"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6 text-text">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <UserProfile userData={userData} />
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Manage your account settings and preferences
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Email</h3>
                  <p className="text-text">{userData?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Account Created</h3>
                  <p className="text-text">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <MetricsForm userData={userData} />
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Manage your data and privacy preferences
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Sharing</h3>
                    <p className="text-sm text-gray-500">Allow anonymous data sharing for app improvement</p>
                  </div>
                  <div>
                    <input type="checkbox" id="data-sharing" className="rounded text-primary focus:ring-primary" defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive weekly progress reports via email</p>
                  </div>
                  <div>
                    <input type="checkbox" id="email-notifications" className="rounded text-primary focus:ring-primary" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
