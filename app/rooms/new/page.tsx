import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRoom } from "@/app/actions";
import { requireRole } from "@/app/lib/auth";

export default async function NewRoomPage() {
  const currentUser = await requireRole();
  const user = currentUser.kindeUser;

  return (
    <div className="container mx-auto px-5 py-10 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/20">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Manager tools</p>
          <h1 className="text-4xl font-semibold text-white">Add a karaoke room</h1>
          <p className="text-slate-400">
            Create a new room listing with hourly pricing, capacity, and VIP status.
          </p>
        </div>

        <form action={createRoom} className="space-y-8">
          <input type="hidden" name="managerId" value={user.id} />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="name">Room name</Label>
              <Input id="name" name="name" type="text" required placeholder="Neon Pulse Room" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="pricePerHour">Price per hour</Label>
              <Input id="pricePerHour" name="pricePerHour" type="number" required placeholder="120" min={0} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" required placeholder="8" min={1} />
            </div>
            <div className="space-y-3">
              <Label htmlFor="roomType">Room type</Label>
              <Select name="roomType">
                <SelectTrigger id="roomType" className="w-full">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Room types</SelectLabel>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="LUXURY">Luxury</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required placeholder="Premium lounge with sound system and neon lighting." rows={6} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="images">Image URLs</Label>
            <Textarea
              id="images"
              name="images"
              placeholder="Enter image URLs separated by commas"
              rows={3}
            />
            <p className="text-sm text-slate-500">Use comma-separated image URLs for room gallery preview.</p>
          </div>

          <Card className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <CardHeader className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-400">Booking readiness</p>
              <p className="text-slate-400">New rooms are created with AVAILABLE status and can be managed from the dashboard.</p>
            </CardHeader>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Create Room
          </Button>
        </form>
      </div>
    </div>
  );
}
