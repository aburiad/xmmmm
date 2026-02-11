import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { HelpCircle, Keyboard, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Mobile: icon only, Desktop: icon + text */}
        <Button variant="outline" size="sm" className="md:min-w-fit">
          <HelpCircle className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">সাহায্য</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>সাহায্য ও নির্দেশনা</DialogTitle>
          <DialogDescription>
            প্রশ্নপত্র তৈরি করার জন্য টিপস এবং শর্টকাট
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tips" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tips">
              <Lightbulb className="w-4 h-4 mr-2" />
              টিপস
            </TabsTrigger>
            <TabsTrigger value="latex">
              <Keyboard className="w-4 h-4 mr-2" />
              LaTeX গাইড
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tips">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">প্রশ্ন তৈরির ধাপ</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                    <li>প্রথমে প্রশ্নপত্র সেটআপ সম্পন্ন করুন</li>
                    <li>প্রশ্নের ধরন নির্বাচন করুন</li>
                    <li>ব্লক যোগ করে প্রশ্ন তৈরি করুন</li>
                    <li>নম্বর এবং ঐচ্ছিক অবস্থা সেট করুন</li>
                    <li>প্রশ্ন সংরক্ষণ করুন</li>
                    <li>প্রিভিউতে যান</li>
                    <li>"PDF ডাউনলোড করুন" বাটনে ক্লিক করুন</li>
                    <li>PDF স্বয়ংক্রিয়ভাবে ডাউনলোড হবে</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">ব্লক ব্যবহার</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li><strong>টেক্সট:</strong> সাধারণ প্রশ্ন বা বিবরণ লেখার জন্য</li>
                    <li><strong>সূত্র:</strong> গণিতের সূত্র LaTeX ফরম্যাটে লেখার জন্য</li>
                    <li><strong>ছবি:</strong> ছবি URL যোগ করার জন্য</li>
                    <li><strong>টেবিল:</strong> সারি এবং কলাম দিয়ে টেবিল তৈরি করার জন্য</li>
                    <li><strong>চিত্র:</strong> জ্যামিতিক চিত্র বর্ণনা লেখার জন্য</li>
                    <li><strong>তালিকা:</strong> একাধিক আইটেম তালিকা তৈরি করার জন্য</li>
                    <li><strong>ফাঁকা স্থান:</strong> উত্তর লেখার জন্য জায়গা তৈরি করার জন্য</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">সৃজনশীল প্রশ্ন</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>প্রশ্নের ধরন "সৃজনশীল" নির্বাচন করুন</li>
                    <li>প্রথমে উদ্দীপক/স্টেম লিখুন</li>
                    <li>"উপপ্রশ্ন যোগ করুন" বাটনে ক্লিক করুন</li>
                    <li>ক, খ, গ, ঘ প্রতিটি উপপ্রশ্নের জন্য আলাদা নম্বর দিন</li>
                    <li>সর্বোচ্চ ৪টি উপপ্রশ্ন যোগ করা যাবে</li>
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>টিপ:</strong> প্রশ্নপত্র তৈরি করার সময় নিয়মিত সংরক্ষণ করুন। সব ডেটা আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত থাকবে।
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="latex">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">প্রাথমিক LaTeX সিনট্যাক্স</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">x^2</code>
                      <span className="text-slate-600">→ x²</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">x_1</code>
                      <span className="text-slate-600">→ x₁</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\frac{'{a}{b}'}</code>
                      <span className="text-slate-600">→ a/b (ভগ্নাংশ)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\sqrt{'{x}'}</code>
                      <span className="text-slate-600">→ √x</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\sqrt[3]{'{x}'}</code>
                      <span className="text-slate-600">→ ∛x</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">গ্রীক অক্ষর</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\alpha</code> → α
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\beta</code> → β
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\theta</code> → θ
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\pi</code> → π
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">বিশেষ চিহ্ন</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\leq</code>
                      <span className="text-slate-600">→ ≤</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\geq</code>
                      <span className="text-slate-600">→ ≥</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\neq</code>
                      <span className="text-slate-600">→ ≠</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\approx</code>
                      <span className="text-slate-600">→ ≈</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                      <code className="text-xs">\infty</code>
                      <span className="text-slate-600">→ ∞</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">ত্রিকোণমিতি</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\sin</code>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\cos</code>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\tan</code>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <code className="text-xs">\log</code>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                  <p className="text-sm text-amber-900">
                    <strong>মনে রাখুন:</strong> LaTeX এ কার্লি ব্রেস {'{}'} ব্যবহার করে গ্রুপিং করা হয়। যেমন: x^{'{2y}'} সঠিক, কিন্তু x^2y ভুল হবে।
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}