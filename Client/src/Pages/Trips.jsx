import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    ArrowRight,
    Plane,
    Cloud,
    Plus,
    DollarSign,
    ChevronRight
} from 'lucide-react';
import { tripApiService } from '../services/tripApiService';
import { toast } from 'react-hot-toast';

const Trips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await tripApiService.getTrips();
                setTrips(data);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
                toast.error('Failed to load trips');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
                {/* Navigation Bar */}
                <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center space-x-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/dashboard')}
                                    className="text-white hover:bg-white/20 rounded-full font-bold px-4 transition-all"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-2" />
                                    Dashboard
                                </Button>
                                <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">My Trips</h1>
                            </div>
                            <Button
                                onClick={() => navigate('/destinations')}
                                className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-6 h-12 shadow-lg transition-all hover:scale-105"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Plan New Trip
                            </Button>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="space-y-8">
                        {trips.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {trips.map((trip) => (
                                    <div
                                        key={trip._id}
                                        className="group relative bg-white/20 backdrop-blur-lg rounded-[20px] shadow-lg overflow-hidden border border-white/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                                        onClick={() => navigate(`/itinerary/${trip._id}`)}
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={trip.destinationId?.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                                                alt={trip.destinationId?.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                                            <div className="absolute top-3 right-3 z-10">
                                                {getStatusBadge(trip.status)}
                                            </div>
                                            <div className="absolute bottom-6 left-6 text-white max-w-[80%]">
                                                <h3 className="text-3xl font-black mb-2 drop-shadow-lg leading-tight">{trip.destinationId?.name || 'Unknown Destination'}</h3>
                                                <div className="flex items-center text-white/90 font-medium text-sm">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {trip.destinationId?.country || 'Unknown Country'}
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center text-white/80 font-bold text-xs space-x-2">
                                                    <Calendar className="h-4 w-4 text-blue-200" />
                                                    <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-black flex items-center">
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} Days
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full py-4 font-black text-sm shadow-lg border border-white/20 transition-all h-12 group-hover:bg-white group-hover:text-blue-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/itinerary/${trip._id}`);
                                                }}
                                            >
                                                View Itinerary <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white/10 backdrop-blur-md rounded-[40px] border-4 border-dashed border-white/30">
                                <div className="max-w-md mx-auto px-6">
                                    <Plane className="h-20 w-20 text-white/50 mx-auto mb-6 animate-pulse" />
                                    <h3 className="text-3xl font-black text-white mb-3">No trips yet</h3>
                                    <p className="text-white/70 text-lg mb-8 tracking-tight">Start planning your first adventure!</p>
                                    <Button
                                        onClick={() => navigate('/destinations')}
                                        className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-full px-12 py-8 text-2xl shadow-2xl transition-all hover:-translate-y-1"
                                    >
                                        Explore Destinations
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trips;
