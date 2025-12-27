import React from 'react';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore } from '../../../store/useSettingsStore';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

export const SettingsSidebar = () => {
  const {
    alarmVolume,
    soundEnabled,
    actions,
  } = useSettingsStore();
  const { setAlarmVolume, setSoundEnabled } = actions;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white rounded-full">
          <Settings className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[#0D1B2A] border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Settings</SheetTitle>
          <SheetDescription className="text-white/60">
            Customize your timer experience.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-8 py-8">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="sound-enabled" className="text-white font-medium">Timer Sound</Label>
              <Text as="span" className="text-xs text-white/60">Play a sound when timer finishes</Text>
            </div>
            <Switch
              id="sound-enabled"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white font-medium">Volume</Label>
              <Text as="span" className="text-xs text-white/60">{Math.round(alarmVolume * 100)}%</Text>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white/60 hover:text-white"
              >
                {soundEnabled && alarmVolume > 0 ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </button>
              <Slider
                value={[alarmVolume]}
                max={1}
                step={0.01}
                onValueChange={(value) => setAlarmVolume(value[0])}
                className="flex-1 [&_.range-slider-thumb]:bg-orange-500 [&_.range-slider-track]:bg-white/20 [&_.range-slider-range]:bg-orange-500"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
