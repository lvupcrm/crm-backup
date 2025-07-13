import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-crm.css';
import { format, isSameDay, parseISO, compareAsc, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const initialForm = {
  customerName: '',
  phoneNumber: '',
  email: '',
  consultationDate: '',
  consultationTime: '',
  consultationType: '',
  consultationStatus: '',
  notes: '',
};

const getTodayStr = () => {
  const today = new Date();
  return format(today, 'yyyy-MM-dd');
};

interface ConsultationCustomer {
  id: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  consultationDate: string;
  consultationTime: string;
  consultationType: string;
  consultationStatus: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  notificationStatus: string;
}

const ConsultationPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<ConsultationCustomer[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(getTodayStr());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showNewConsultationModal, setShowNewConsultationModal] = useState(false);
  const [completedCustomer, setCompletedCustomer] = useState<ConsultationCustomer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_API_URL}/api/consultations?date=${date}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ConsultationCustomer[] = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setNotification({ message: 'Failed to fetch consultations.', type: 'info' });
      }
    };

    fetchCustomers();
    const interval = setInterval(fetchCustomers, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [date]);

  const handleSelectChange = (name: string) => (value: string) => {
    setForm((prev: typeof initialForm) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_API_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, consultationDate: date }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newCustomer = await response.json();
      setCustomers(prev => [...prev, newCustomer]);
      setNotification({ message: 'Consultation added successfully!', type: 'success' });
      setShowNewConsultationModal(false);
      setForm(initialForm);
    } catch (error) {
      console.error('Error adding consultation:', error);
      setNotification({ message: 'Failed to add consultation.', type: 'info' });
    }
  };

  const handleEdit = (customer: ConsultationCustomer) => {
    setEditingId(customer.id);
    setForm({
      customerName: customer.customerName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      consultationDate: customer.consultationDate,
      consultationTime: customer.consultationTime,
      consultationType: customer.consultationType,
      consultationStatus: customer.consultationStatus,
      notes: customer.notes,
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const response = await fetch(`${process.env.NEXT_API_URL}/api/consultations/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, consultationDate: date }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedCustomer = await response.json();
      setCustomers(prev => prev.map(c => c.id === editingId ? updatedCustomer : c));
      setEditingId(null);
      setOpen(false);
      setNotification({ message: 'Consultation updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating consultation:', error);
      setNotification({ message: 'Failed to update consultation.', type: 'info' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) {
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_API_URL}/api/consultations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setCustomers(prev => prev.filter(c => c.id !== id));
      setNotification({ message: 'Consultation deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting consultation:', error);
      setNotification({ message: 'Failed to delete consultation.', type: 'info' });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_API_URL}/api/consultations/${id}/complete`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedCustomer = await response.json();
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      setNotification({ message: 'Consultation completed successfully!', type: 'success' });
    } catch (error) {
      console.error('Error completing consultation:', error);
      setNotification({ message: 'Failed to complete consultation.', type: 'info' });
    }
  };

  const handleNotificationStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_API_URL}/api/consultations/${id}/notification-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationStatus: status }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedCustomer = await response.json();
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      setNotification({ message: 'Notification status updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating notification status:', error);
      setNotification({ message: 'Failed to update notification status.', type: 'info' });
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    setDate(format(selectedDate, 'yyyy-MM-dd'));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: typeof initialForm) => ({ ...prev, consultationTime: e.target.value }));
  };

  const handleConsultationTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: typeof initialForm) => ({ ...prev, consultationType: e.target.value }));
  };

  const handleConsultationStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: typeof initialForm) => ({ ...prev, consultationStatus: e.target.value }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev: typeof initialForm) => ({ ...prev, notes: e.target.value }));
  };

  const handleNewConsultationClick = () => {
    setShowNewConsultationModal(true);
  };

  const handleCloseModal = () => {
    setShowNewConsultationModal(false);
  };

  const handleSaveModal = () => {
    handleSubmit(new Event('submit') as any); // Simulate form submission
  };

  const handleCancelModal = () => {
    setShowNewConsultationModal(false);
    setForm(initialForm);
  };

  const handleEditModal = () => {
    handleUpdate();
  };

  const handleDeleteModal = () => {
    handleDelete(editingId || '');
  };

  const handleCompleteModal = () => {
    handleComplete(editingId || '');
  };

  const handleNotificationStatusChangeModal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleNotificationStatusChange(editingId || '', e.target.value);
  };

  const filteredCustomers = customers.filter(customer => {
    const consultationDate = parseISO(customer.consultationDate);
    return isSameDay(consultationDate, new Date(date));
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Consultation Management</h1>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Consultations for {format(new Date(date), 'MM/dd/yyyy')}</h2>
        <Button onClick={handleNewConsultationClick}>New Consultation</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Calendar
            onChange={handleDateChange}
            value={new Date(date)}
            className="react-calendar"
          />
        </div>
        <div>
          <Label htmlFor="consultationType">Consultation Type</Label>
          <Select onValueChange={handleConsultationTypeChange} value={form.consultationType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="In-Person">In-Person</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="consultationStatus">Status</Label>
          <Select onValueChange={handleConsultationStatusChange} value={form.consultationStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Customer Name</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Consultation Date</th>
              <th className="py-2 px-4 border-b">Consultation Time</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Notes</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-2 px-4 border-b">{customer.customerName}</td>
                <td className="py-2 px-4 border-b">{customer.phoneNumber}</td>
                <td className="py-2 px-4 border-b">{customer.email}</td>
                <td className="py-2 px-4 border-b">{format(parseISO(customer.consultationDate), 'MM/dd/yyyy')}</td>
                <td className="py-2 px-4 border-b">{customer.consultationTime}</td>
                <td className="py-2 px-4 border-b">{customer.consultationType}</td>
                <td className="py-2 px-4 border-b">{customer.consultationStatus}</td>
                <td className="py-2 px-4 border-b">{customer.notes}</td>
                <td className="py-2 px-4 border-b">
                  <Button variant="outline" onClick={() => handleEdit(customer)}>Edit</Button>
                  <Button variant="outline" onClick={() => handleDelete(customer.id)}>Delete</Button>
                  {customer.consultationStatus !== 'Completed' && (
                    <Button variant="outline" onClick={() => handleComplete(customer.id)}>Complete</Button>
                  )}
                  <Select onValueChange={handleNotificationStatusChange} value={customer.notificationStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Notification Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notification && (
        <div className={`mt-4 p-3 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {notification.message}
        </div>
      )}

      {showNewConsultationModal && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Consultation' : 'New Consultation'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="consultationDate">Consultation Date</Label>
                <Input
                  id="consultationDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="consultationTime">Consultation Time</Label>
                <Input
                  id="consultationTime"
                  type="time"
                  value={form.consultationTime}
                  onChange={handleTimeChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="consultationType">Consultation Type</Label>
                <Input
                  id="consultationType"
                  value={form.consultationType}
                  onChange={handleConsultationTypeChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="consultationStatus">Consultation Status</Label>
                <Input
                  id="consultationStatus"
                  value={form.consultationStatus}
                  onChange={handleConsultationStatusChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={handleNotesChange}
                  rows={3}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelModal}>Cancel</Button>
                <Button type="submit">{editingId ? 'Update' : 'Add'} Consultation</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ConsultationPage; 