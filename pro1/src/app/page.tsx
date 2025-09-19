
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Plane, cleaningStatuses, fuelLevels, type CleaningStatus, type FuelLevel } from "@/types";
import { AddPlaneDialog } from "@/components/add-plane-dialog";
import { PlaneCard } from "@/components/plane-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export default function Home() {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDirtyFirst, setSortDirtyFirst] = useState(false);
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "planes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const planesData: Plane[] = [];
      querySnapshot.forEach((doc) => {
        planesData.push({ ...doc.data(), id: doc.id } as Plane);
      });
      setPlanes(planesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching planes: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sortedPlanes = useMemo(() => {
    return [...planes].sort((a, b) => {
      if (sortDirtyFirst) {
        const aIndex = cleaningStatuses.indexOf(a.cleaningStatus);
        const bIndex = cleaningStatuses.indexOf(b.cleaningStatus);
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
      }
      return a.tailNumber.localeCompare(b.tailNumber);
    });
  }, [planes, sortDirtyFirst]);


  const handleAddPlane = async (planeData: Omit<Plane, 'id'>) => {
    try {
      await addDoc(collection(db, "planes"), planeData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDeletePlane = async (id: string) => {
    try {
      await deleteDoc(doc(db, "planes", id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleUpdatePlane = async (id: string, updates: Partial<Pick<Plane, 'fuelLevel' | 'cleaningStatus'>>) => {
    try {
      const planeDoc = doc(db, "planes", id);
      await updateDoc(planeDoc, updates);
    } catch(e) {
      console.error("Error updating document: ", e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card/50 py-24 text-center min-h-screen">
          <h2 className="text-xl font-semibold tracking-tight">
            Loading...
          </h2>
          <p className="mt-2 text-muted-foreground">
            Please wait while we connect to the hangar.
          </p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
              MGAV
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="sort-dirty" onCheckedChange={setSortDirtyFirst} checked={sortDirtyFirst} />
              <Label htmlFor="sort-dirty">Prioritize Dirty</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="list-view" onCheckedChange={setIsListView} checked={isListView} />
              <Label htmlFor="list-view">List View</Label>
            </div>
            <Button asChild variant="outline">
              <Link href="/todo">Todo List</Link>
            </Button>
            <AddPlaneDialog onAddPlane={handleAddPlane} />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {sortedPlanes.length > 0 ? (
          isListView ? (
            <Accordion type="multiple" className="w-full max-w-2xl mx-auto">
              {sortedPlanes.map((plane) => (
                <AccordionItem value={plane.id} key={plane.id}>
                  <AccordionTrigger className="font-medium">{plane.tailNumber}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-1">
                      <div className="space-y-1.5">
                        <Label htmlFor={`fuel-level-list-${plane.id}`} className="text-xs">Fuel Level</Label>
                        <Select
                          value={plane.fuelLevel}
                          onValueChange={(value: FuelLevel) => handleUpdatePlane(plane.id, { fuelLevel: value })}
                        >
                          <SelectTrigger id={`fuel-level-list-${plane.id}`} className="w-full h-8">
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
                        <Label htmlFor={`cleaning-status-list-${plane.id}`} className="text-xs">Cleaning Status</Label>
                        <Select
                          value={plane.cleaningStatus}
                          onValueChange={(value: CleaningStatus) => handleUpdatePlane(plane.id, { cleaningStatus: value })}
                        >
                          <SelectTrigger id={`cleaning-status-list-${plane.id}`} className="w-full h-8">
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
                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDeletePlane(plane.id)}
                          aria-label={`Delete plane ${plane.tailNumber}`}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedPlanes.map((plane) => (
                <PlaneCard
                  key={plane.id}
                  plane={plane}
                  onUpdate={handleUpdatePlane}
                  onDelete={handleDeletePlane}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card/50 py-24 text-center">
             <h2 className="text-xl font-semibold tracking-tight">
                No Planes Added
             </h2>
             <p className="mt-2 text-muted-foreground">
               Click "Add Plane" to get started and manage your fleet.
             </p>
          </div>
        )}
      </main>
    </div>
  );
}
