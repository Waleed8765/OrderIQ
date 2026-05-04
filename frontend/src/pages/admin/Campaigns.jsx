import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, Filter, Megaphone, Star, MapPin } from 'lucide-react';
import { useAdminFilters } from '../../features/admin/AdminFiltersContext';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-hot-toast';

const CampaignsPage = () => {
    const { searchQuery, setSearchQuery } = useAdminFilters();
    const [showFilters, setShowFilters] = useState(false);
    const [promotionFilter, setPromotionFilter] = useState('All');
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllRestaurants();
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            toast.error('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePromotion = async (restaurantId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await adminService.toggleRestaurantPromotion(restaurantId, newStatus);
            setRestaurants(prev => prev.map(r => 
                r.id === restaurantId ? { ...r, promoted: newStatus } : r
            ));
            toast.success(`Restaurant ${newStatus ? 'promoted' : 'unpromoted'} successfully`);
        } catch (error) {
            console.error('Error toggling promotion:', error);
            toast.error('Failed to update promotion status');
        }
    };

    const filteredRestaurants = useMemo(() => {
        const search = searchQuery.trim().toLowerCase();
        return restaurants.filter(restaurant => {
            const matchesSearch = !search
                || restaurant.name.toLowerCase().includes(search)
                || restaurant.city.toLowerCase().includes(search)
                || restaurant.area.toLowerCase().includes(search);
            
            const matchesPromotion = promotionFilter === 'All' 
                || (promotionFilter === 'Promoted' && restaurant.promoted)
                || (promotionFilter === 'Regular' && !restaurant.promoted);

            return matchesSearch && matchesPromotion;
        });
    }, [restaurants, searchQuery, promotionFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Restaurant Promotions</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage which restaurants are featured as promoted across the platform.</p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="relative">
                        <Button variant="outline" icon={Filter} onClick={() => setShowFilters(prev => !prev)}>
                            Filters
                        </Button>
                        {showFilters && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Promotion Status</div>
                                <div className="flex flex-col gap-1">
                                    {['All', 'Promoted', 'Regular'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setPromotionFilter(status);
                                                setShowFilters(false);
                                            }}
                                            className={`px-3 py-2 rounded-md text-sm text-left ${promotionFilter === status ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Card className="overflow-hidden shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Restaurant</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Promoted</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-4"><div className="h-10 w-40 bg-gray-100 rounded"></div></td>
                                        <td className="p-4"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                                        <td className="p-4"><div className="h-4 w-12 bg-gray-100 rounded"></div></td>
                                        <td className="p-4"><div className="h-6 w-12 bg-gray-100 rounded mx-auto"></div></td>
                                        <td className="p-4"><div className="h-8 w-20 bg-gray-100 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredRestaurants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-sm text-gray-500">
                                        No restaurants found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredRestaurants.map(restaurant => (
                                    <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {restaurant.logo ? (
                                                    <img src={restaurant.logo} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Megaphone className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{restaurant.name}</p>
                                                    <p className="text-xs text-gray-500">{restaurant.businessType}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-xs text-gray-600">
                                                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                                {restaurant.area}, {restaurant.city}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                                {restaurant.rating}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {restaurant.promoted ? (
                                                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    Promoted
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    Regular
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button 
                                                variant={restaurant.promoted ? "outline" : "primary"}
                                                size="sm"
                                                onClick={() => handleTogglePromotion(restaurant.id, restaurant.promoted)}
                                            >
                                                {restaurant.promoted ? 'Unpromote' : 'Promote'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default CampaignsPage;
