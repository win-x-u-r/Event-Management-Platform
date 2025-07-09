
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Budget, Event } from '@/services/api';
import { isTreasurer } from '@/utils/userUtils';
import { DollarSign, CheckCircle, XCircle, Eye, LogOut } from 'lucide-react';

const TreasurerDashboard = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is authorized treasurer
  useEffect(() => {
    if (!user || !isTreasurer(user.email || '')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  }, [user, navigate, toast]);

  // Fetch budgets and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [budgetsData, eventsData] = await Promise.all([
          apiService.getBudgets(),
          apiService.getEvents()
        ]);
        setBudgets(budgetsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load budget data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && isTreasurer(user.email || '')) {
      fetchData();
    }
  }, [user, toast]);

  const getEventName = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown Event';
  };

  const handleApprove = async (budgetId: number) => {
    try {
      const updatedBudget = await apiService.updateBudget(budgetId, { 
        budget_status: 'Granted' 
      });

      setBudgets(budgets.map(budget => 
        budget.id === budgetId 
          ? { ...budget, budget_status: 'Granted' }
          : budget
      ));

      toast({
        title: "Budget Approved",
        description: "Budget has been successfully approved.",
      });
    } catch (error) {
      console.error('Error approving budget:', error);
      toast({
        title: "Error",
        description: "Failed to approve budget.",
        variant: "destructive",
      });
    }
  };

  const handleDeny = async (budgetId: number) => {
    try {
      const updatedBudget = await apiService.updateBudget(budgetId, { 
        budget_status: 'Denied' 
      });

      setBudgets(budgets.map(budget => 
        budget.id === budgetId 
          ? { ...budget, budget_status: 'Denied' }
          : budget
      ));

      toast({
        title: "Budget Denied",
        description: "Budget has been denied.",
      });
    } catch (error) {
      console.error('Error denying budget:', error);
      toast({
        title: "Error",
        description: "Failed to deny budget.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100">
      {/* Header */}
      <header className="bg-white border-b border-red-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Treasurer Dashboard</h1>
                <p className="text-sm text-gray-600">AURAK Event Management Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.first_name} {user?.last_name}</span>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Budgets</p>
                  <p className="text-2xl font-bold text-gray-900">{budgets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {budgets.filter(b => b.budget_status.toLowerCase() === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {budgets.filter(b => b.budget_status.toLowerCase() === 'granted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Budget Requests</CardTitle>
            <CardDescription>Review and manage event budget requests</CardDescription>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No budget requests found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div key={budget.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{budget.item_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Event: {getEventName(budget.event)}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Quantity:</span>
                            <span className="ml-2">{budget.item_quantity}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Unit Cost:</span>
                            <span className="ml-2">AED {budget.item_cost}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Total Cost:</span>
                            <span className="ml-2 font-semibold">AED {budget.total_cost}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end space-y-2">
                        {getStatusBadge(budget.budget_status)}
                        {budget.budget_status.toLowerCase() === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleApprove(budget.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleDeny(budget.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Deny
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TreasurerDashboard;
