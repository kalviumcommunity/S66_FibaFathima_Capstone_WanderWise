import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Plane,
    Calendar,
    DollarSign,
    ArrowLeft,
    Cloud,
    Globe,
    ChevronRight,
    MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripApiService } from '../services/tripApiService';
import { toast } from 'react-hot-toast';

const Trips = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const tripsData = await tripApiService.getTrips();
                setTrips(tripsData);

                // Calculate total spent across all trips
                const total = tripsData.reduce((sum, trip) => sum + (trip.budget || 0), 0);
                setTotalSpent(total);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
                toast.error('Failed to load trips');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTrips();
        }
    }, [user]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming':
                return <Badge className="bg-emerald-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Upcoming</Badge>;
            case 'completed':
                return <Badge className="bg-blue-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Cancelled</Badge>;
            default:
                return <Badge className="bg-gray-500 text-white border-none px-3 py-1 rounded-full text-xs font-black uppercase">Active</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4facfe] to-[#00f2fe]">
                <div className="w-24 h-24 border-8 border-white/20 border-t-white rounded-full animate-spin shadow-2xl"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] dark:from-[#4facfe] dark:to-[#a1c4fd] bg-fixed transition-colors duration-1000 font-sans">

            {/* Decorative Clouds */}
            <div className="absolute top-20 left-10 opacity-30 dark:opacity-10 animate-float pointer-events-none z-0">
                <Cloud className="w-24 h-24 text-white fill-white drop-shadow-xl" />
            </div>
            <div className="absolute top-60 right-20 opacity-20 dark:opacity-5 animate-float animation-delay-2000 pointer-events-none z-0">
                <Cloud className="w-32 h-32 text-white fill-white drop-shadow-xl" />
            </div>

            {/* Night Mode Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* Navigation */}
                <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center space-x-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/dashboard')}
                                    className="text-white hover:bg-white/20 rounded-full font-black px-6 transition-all"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-2 stroke-[3px]" />
                                    Dashboard
                                </Button>
                                <Link to="/" className="flex items-center space-x-3 group">
                                    <div className="bg-white p-2 rounded-2xl shadow-xl transform group-hover:rotate-12 transition-transform">
                                        <Globe className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <span className="text-2xl font-black text-white tracking-tighter">WanderWise</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter drop-shadow-2xl transform -rotate-1">
                            My Trips ✈️
                        </h1>
                        <p className="text-white/90 text-lg font-medium tracking-tight drop-shadow-lg">
                            All your adventures in one place
                        </p>
                    </div>

                    {/* Total Spent Card */}
                    <div className="mb-8">
                        <Card className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-[20px] shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-black text-white/60 uppercase tracking-widest mb-2">Total Spent</p>
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="h-8 w-8 text-white stroke-[3px]" />
                                            <span className="text-4xl font-black text-white tracking-tighter drop-shadow-sm">
                                                {totalSpent.toLocaleString()}
                                            </span>
                                            <span className="text-xl font-bold text-white/80">INR</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-emerald-500 rounded-lg shadow-lg transform -rotate-12">
                                        <DollarSign className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trips Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.length > 0 ? trips.map((trip) => (
                            <div
                                key={trip._id || trip.id}
                                className="group relative bg-white/20 backdrop-blur-lg rounded-[20px] shadow-lg overflow-hidden border border-white/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                                onClick={() => navigate(`/itinerary/${trip._id || trip.id}`)}
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={trip.destinationImage || trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                                        alt={trip.destinationName || trip.destination}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute top-3 right-3 z-10">
                                        {getStatusBadge(trip.status)}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-blue-100 transition-colors uppercase drop-shadow-sm">
                                        {trip.destinationName || trip.destination}
                                    </h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center space-x-2 text-white/70 font-bold text-xs">
                                            <Calendar className="h-4 w-4 text-blue-200" />
                                            <span>{(trip.startDate || trip.date) ? new Date(trip.startDate || trip.date).toLocaleDateString() : 'No date'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-white/70 font-bold text-xs">
                                            <MapPin className="h-4 w-4 text-blue-200" />
                                            <span>{trip.itinerary?.length || 0} days planned</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-1 text-white font-black text-lg">
                                            <DollarSign className="h-5 w-5 stroke-[2px]" />
                                            <span>{(trip.budget || 0).toLocaleString()}</span>
                                            <span className="text-sm">{trip.currency || 'INR'}</span>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full py-4 font-black text-sm shadow-lg border border-white/20 transition-all h-10">
                                        View Itinerary <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-24 bg-white/10 backdrop-blur-md rounded-[40px] border-4 border-dashed border-white/30 text-center">
                                <Plane className="h-20 w-20 text-white/50 mx-auto mb-6 animate-pulse" />
                                <h3 className="text-3xl font-black text-white mb-3">No trips yet</h3>
                                <p className="text-white/70 text-lg mb-8 tracking-tight">Start planning your first adventure!</p>
                                <Link to="/destinations">
                                    <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-12 py-8 text-2xl shadow-2xl">
                                        Explore Destinations
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trips;
