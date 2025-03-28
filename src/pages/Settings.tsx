
import { useState } from "react";
import { Check, Save, Trash, RefreshCw, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { getLocations } from "@/lib/traffic-service";

// Form schema for general settings
const generalSettingsSchema = z.object({
  systemName: z.string().min(2, { message: "System name must be at least 2 characters." }),
  refreshInterval: z.string(),
  defaultLocation: z.string(),
  darkMode: z.boolean().default(false),
  notifications: z.boolean().default(true),
  dataRetention: z.string(),
});

// Form schema for API settings
const apiSettingsSchema = z.object({
  googleMapsApiKey: z.string().min(1, { message: "API key is required" }),
  weatherApiKey: z.string().min(1, { message: "API key is required" }),
  maxRequestsPerMinute: z.string(),
  apiTimeout: z.string(),
});

// Form schema for notification settings
const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  notificationEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  congestionAlerts: z.boolean().default(true),
  incidentAlerts: z.boolean().default(true),
  systemAlerts: z.boolean().default(true),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type ApiSettingsValues = z.infer<typeof apiSettingsSchema>;
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch locations for the location dropdown
  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations
  });
  
  // General settings form
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      systemName: "SmartRouteX",
      refreshInterval: "30",
      defaultLocation: "1",
      darkMode: true,
      notifications: true,
      dataRetention: "90",
    },
  });
  
  // API settings form
  const apiForm = useForm<ApiSettingsValues>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      googleMapsApiKey: "AIza...",
      weatherApiKey: "wapi...",
      maxRequestsPerMinute: "100",
      apiTimeout: "30",
    },
  });
  
  // Notification settings form
  const notificationForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      notificationEmail: "admin@smartroutex.io",
      congestionAlerts: true,
      incidentAlerts: true,
      systemAlerts: true,
    },
  });
  
  const onSubmitGeneral = (data: GeneralSettingsValues) => {
    saveSettings(data, "General settings updated successfully");
  };
  
  const onSubmitApi = (data: ApiSettingsValues) => {
    saveSettings(data, "API settings updated successfully");
  };
  
  const onSubmitNotifications = (data: NotificationSettingsValues) => {
    saveSettings(data, "Notification settings updated successfully");
  };
  
  const saveSettings = (data: any, successMessage: string) => {
    setIsSaving(true);
    
    // Simulating API call
    setTimeout(() => {
      console.log("Saved settings:", data);
      toast.success(successMessage);
      setIsSaving(false);
    }, 1500);
  };
  
  const handleResetSettings = () => {
    if (activeTab === "general") {
      generalForm.reset();
    } else if (activeTab === "api") {
      apiForm.reset();
    } else if (activeTab === "notifications") {
      notificationForm.reset();
    }
    
    toast.info("Settings reset to defaults");
  };
  
  const handleBackupData = () => {
    toast.success("System backup initiated. You will be notified when complete.");
  };
  
  const handleRestoreData = () => {
    toast.success("System restore initiated. You will be notified when complete.");
  };
  
  return (
    <PageLayout title="System Settings">
      <div className="space-y-6">
        <Tabs defaultValue="general" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="systemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter system name" {...field} />
                          </FormControl>
                          <FormDescription>The name displayed throughout the system</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="refreshInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Refresh Interval (seconds)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select interval" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 seconds</SelectItem>
                              <SelectItem value="30">30 seconds</SelectItem>
                              <SelectItem value="60">1 minute</SelectItem>
                              <SelectItem value="300">5 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How often the system refreshes data</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="defaultLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Location</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select default location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations?.map(location => (
                                <SelectItem 
                                  key={location.id} 
                                  value={location.id.toString()}
                                >
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Default focus area on the map</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="darkMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Dark Mode</FormLabel>
                            <FormDescription>
                              Enable dark mode by default
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notifications</FormLabel>
                            <FormDescription>
                              Enable system notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="dataRetention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Retention Period (days)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select retention period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                              <SelectItem value="365">1 year</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How long historical data is kept in the system</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleResetSettings}
                      >
                        Reset to Defaults
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Manage API keys and integration settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...apiForm}>
                  <form onSubmit={apiForm.handleSubmit(onSubmitApi)} className="space-y-4">
                    <FormField
                      control={apiForm.control}
                      name="googleMapsApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Maps API Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter API key" {...field} type="password" />
                          </FormControl>
                          <FormDescription>
                            Used for maps integration and routing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={apiForm.control}
                      name="weatherApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weather API Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter API key" {...field} type="password" />
                          </FormControl>
                          <FormDescription>
                            Used for weather data integration
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={apiForm.control}
                      name="maxRequestsPerMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max API Requests (per minute)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select limit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="60">60 requests</SelectItem>
                              <SelectItem value="100">100 requests</SelectItem>
                              <SelectItem value="200">200 requests</SelectItem>
                              <SelectItem value="500">500 requests</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Rate limiting for external API calls</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={apiForm.control}
                      name="apiTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Timeout (seconds)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeout" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10">10 seconds</SelectItem>
                              <SelectItem value="30">30 seconds</SelectItem>
                              <SelectItem value="60">60 seconds</SelectItem>
                              <SelectItem value="120">120 seconds</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Maximum time to wait for API responses</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleResetSettings}
                      >
                        Reset to Defaults
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive alerts via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications</FormLabel>
                              <FormDescription>
                                Receive alerts in browser
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={notificationForm.control}
                      name="notificationEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address" {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            Email address to receive notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="congestionAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Congestion Alerts</FormLabel>
                              <FormDescription>
                                Traffic congestion notifications
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="incidentAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Incident Alerts</FormLabel>
                              <FormDescription>
                                Traffic incident notifications
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="systemAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">System Alerts</FormLabel>
                              <FormDescription>
                                System status notifications
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleResetSettings}
                      >
                        Reset to Defaults
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>Backup, restore and system operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Data Backup</CardTitle>
                      <CardDescription>System data backup and export</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">
                        Create a backup of system data including settings, configurations, and historical traffic data.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={handleBackupData}
                      >
                        Backup System Data
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Data Restore</CardTitle>
                      <CardDescription>Restore system from backup</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">
                        Restore system data from a previous backup. All current data will be replaced.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleRestoreData}
                      >
                        Restore System Data
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card className="border-red-300 dark:border-red-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-500">
                      Irreversible system operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-300 dark:border-red-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">Clear Historical Data</h4>
                        <p className="text-sm text-muted-foreground">
                          Remove all historical traffic data from the system
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-1" />
                        Clear Data
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-red-300 dark:border-red-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">Reset System</h4>
                        <p className="text-sm text-muted-foreground">
                          Reset the entire system to factory defaults
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Factory Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Settings;
