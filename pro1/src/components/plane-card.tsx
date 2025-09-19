"use client";

import type { Plane, FuelLevel, CleaningStatus } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { fuelLevels, cleaningStatuses } from '@/types';

type PlaneCardProps = {
  plane: Plane;
  onUpdate: (id: string, updates: Partial<Pick<Plane, 'fuelLevel' | 'cleaningStatus'>>) => void;
  onDelete: (id: string) => void;
};

export function PlaneCard({ plane, onUpdate, onDelete }: PlaneCardProps) {
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="font-headline text-xl">{plane.tailNumber}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 p-4 pt-0">
        <div className="space-y-1.5">
          <Label htmlFor={`fuel-level-${plane.id}`} className="text-xs">Fuel Level</Label>
          <Select
            value={plane.fuelLevel}
            onValueChange={(value: FuelLevel) => onUpdate(plane.id, { fuelLevel: value })}
          >
            <SelectTrigger id={`fuel-level-${plane.id}`} className="w-full h-9">
              <SelectValue placeholder="Select fuel level" />
            </SelectTrigger>
            <SelectContent>
              {fuelLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`cleaning-status-${plane.id}`} className="text-xs">Cleaning Status</Label>
          <Select
            value={plane.cleaningStatus}
            onValueChange={(value: CleaningStatus) => onUpdate(plane.id, { cleaningStatus: value })}
          >
            <SelectTrigger id={`cleaning-status-${plane.id}`} className="w-full h-9">
              <SelectValue placeholder="Select cleaning status" />
            </SelectTrigger>
            <SelectContent>
              {cleaningStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onDelete(plane.id)}
          aria-label={`Delete plane ${plane.tailNumber}`}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
