import { PageContainer } from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageMealLog } from '@/components/ImageMealLog';
import { ManualMealLog } from '@/components/ManualMealLog';

export default function LogMealPage() {
  return (
    <PageContainer title="Log Your Meal">
      <Tabs defaultValue="image" className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
          <TabsTrigger value="image" className="py-2.5 md:py-2 text-sm md:text-base">Log with Image</TabsTrigger>
          <TabsTrigger value="manual" className="py-2.5 md:py-2 text-sm md:text-base">Log Manually</TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-0">
          <ImageMealLog />
        </TabsContent>
        <TabsContent value="manual" className="mt-0">
          <ManualMealLog />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
