import { PageContainer } from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageMealLog } from '@/components/ImageMealLog';
import { ManualMealLog } from '@/components/ManualMealLog';

export default function LogMealPage() {
  return (
    <PageContainer title="Log Your Meal">
      <Tabs defaultValue="image" className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">Log with Image</TabsTrigger>
          <TabsTrigger value="manual">Log Manually</TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-6">
          <ImageMealLog />
        </TabsContent>
        <TabsContent value="manual" className="mt-6">
          <ManualMealLog />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
