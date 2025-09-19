"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cleaningStatuses, fuelLevels, type Plane } from "@/types";

const planeSchema = z.object({
  tailNumber: z.string().min(3, { message: "Tail number must be at least 3 characters." }).max(10),
  fuelLevel: z.enum(fuelLevels),
  cleaningStatus: z.enum(cleaningStatuses),
});

type AddPlaneDialogProps = {
  onAddPlane: (plane: Omit<Plane, 'id'>) => void;
};

export function AddPlaneDialog({ onAddPlane }: AddPlaneDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof planeSchema>>({
    resolver: zodResolver(planeSchema),
    defaultValues: {
      tailNumber: "",
      fuelLevel: "Tabs",
      cleaningStatus: "C",
    },
  });

  function onSubmit(values: z.infer<typeof planeSchema>) {
    onAddPlane(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Plane
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Plane</DialogTitle>
          <DialogDescription>
            Enter the details for the new airplane to add it to the fleet.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="tailNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tail Number</FormLabel>
                  <FormControl>
                    <Input placeholder="N12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fuelLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cleaningStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cleaning Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cleaning status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cleaningStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Plane</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
