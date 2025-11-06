import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";

const CalendarPage = () => {
    const [employees, setEmployees] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("day");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const ModalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ModalRef.current && !ModalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [ModalRef])

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [employeesRes, bookingsRes, servicesRes] = await Promise.all([
                    axiosInstance.get("/admin/employees"),
                    axiosInstance.get("/admin/bookings"),
                    axiosInstance.get("/admin/services"),
                ]);
                setEmployees(employeesRes.data.data);
                setBookings(bookingsRes.data.data);
                setServices(servicesRes.data.data || []);
                console.log(bookingsRes)
                if (bookingsRes.data.data.length > 0) {
                    setSelectedDate(new Date(bookingsRes.data.data[0].booking_time));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const hours = Array.from({ length: 24 }, (_, i) => i); // 0:00 to 23:00, good

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    };

    const changeDate = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + direction);
        setSelectedDate(newDate);
    };

    const goToToday = () => setSelectedDate(new Date());

    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const changeMonth = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setSelectedDate(newDate);
    };

    const changeYear = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(newDate.getFullYear() + direction);
        setSelectedDate(newDate);
    };

    // تعديل: إزالة -8 (offset 0 لساعات من 0)، و *60 بدل 140
    const getBookingPosition = (booking) => {
        const date = new Date(booking.booking_time);
        const startHour = date.getUTCHours();  // بدون -8، عشان hours من 0
        const minutes = (startHour * 60) + date.getUTCMinutes();  // تصحيح *60
        return minutes * (80 / 60);
    };

    const getBookingHeight = (booking) => {
        const duration = booking.service?.duration ?? 30;
        const sercice3Duration = booking.service.id === 3 ? 120 : 80
        return duration * (sercice3Duration / 60);
    };

    // تعديل: UTC للتصفية
    const filteredBookings = bookings.filter((b) => {
        const bDate = new Date(b.booking_time);
        return (
            bDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
            bDate.getUTCMonth() === selectedDate.getUTCMonth() &&
            bDate.getUTCDate() === selectedDate.getUTCDate()
        );
    });

    const onSubmit = async (data) => {
        try {
            await axiosInstance.post("/bookings", data);

            setShowModal(false);
            reset();
            const bookingsRes = await axiosInstance.get("/admin/bookings");
            setBookings(bookingsRes.data.data);
        } catch (error) {
            console.error("Error adding booking:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="text-xl text-orange-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <aside className="w-80 bg-white shadow-lg flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-orange-500">
                        Salon<span className="text-orange-400">kee</span>
                    </h1>
                </div>

                <div className="p-6">
                    <div className="bg-gradient-to-br from-orange-300 to-orange-200 rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => changeYear(-1)} className="text-white text-xl hover:bg-white/20 rounded px-2">‹‹</button>
                            <button onClick={() => changeMonth(-1)} className="text-white text-xl hover:bg-white/20 rounded px-2">‹</button>
                            <h3 className="text-white font-semibold">{monthNames[currentMonth]} {currentYear}</h3>
                            <button onClick={() => changeMonth(1)} className="text-white text-xl hover:bg-white/20 rounded px-2">›</button>
                            <button onClick={() => changeYear(1)} className="text-white text-xl hover:bg-white/20 rounded px-2">››</button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-white text-xs mb-2">
                            <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-white text-sm">
                            {[...Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)].map((_, i) => (<div key={`empty-${i}`}></div>))}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
                                return (
                                    <div
                                        key={day}
                                        onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                                        className={`p-1 rounded cursor-pointer ${isSelected ? "bg-white text-orange-500 font-bold" : "hover:bg-white/20"}`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="px-6 flex-1 overflow-auto">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Notifications
                    </h3>
                    <div className="space-y-3">
                        {bookings.slice(-2).reverse().map((booking) => {
                            const createdDate = new Date(booking.created_at);
                            const now = new Date();
                            const diffMs = Math.max(0, now - createdDate);

                            const diffMins = Math.floor(diffMs / 60000);
                            const timeAgo = diffMins < 60 ? `${diffMins} min ago` : diffMins < 1440 ? `${Math.floor(diffMins / 60)} hours ago` : `${Math.floor(diffMins / 1440)} days ago`;
                            return (
                                <div key={booking.id} className="bg-orange-50 rounded-xl p-3 flex gap-3">
                                    <div className="w-10 h-10 bg-orange-300 rounded-full flex-shrink-0 text-white font-bold flex items-center justify-center text-2xl">{booking.customer_name[0]}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{booking.customer_name}</p>
                                        <p className="text-xs text-gray-600">booked an appointment on</p>
                                        <p className="text-xs text-gray-500">{formatTime(booking.booking_time)}</p>
                                    </div>
                                    <div className="text-xs text-gray-400">{timeAgo}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 border-t">
                    <button onClick={() => setShowModal(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors">
                        + Add Booking
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col p-6">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded">‹</button>
                        <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded">›</button>
                    </div>
                    <button onClick={goToToday} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">today</button>
                </div>

                <div className="bg-white rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="flex border-b sticky top-0 bg-white z-10">
                        <div className="w-20 border-r"></div>
                        {employees.map((emp) => (
                            <div key={emp.id} className="flex-1 p-4 text-center border-r">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-orange-200 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold">
                                    {emp.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="font-semibold text-sm">{emp.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 overflow-auto">
                        <div className="flex">
                            <div className="w-20 border-r">
                                {hours.map((hour) => (
                                    <div key={hour} className="h-20 border-b flex items-start justify-center pt-2">
                                        <span className="text-xs text-gray-500">{hour.toString().padStart(2, "0")}:00</span>
                                    </div>
                                ))}
                            </div>

                            {employees.map((emp, empIndex) => (
                                <div key={emp.id} className="flex-1 border-r relative">
                                    {hours.map((hour) => (<div key={hour} className="h-20 border-b"></div>))}
                                    {filteredBookings.filter((booking) => booking.employee_id === emp.id).map((booking, bookingIndex) => {
                                        const top = getBookingPosition(booking);
                                        const height = getBookingHeight(booking);
                                        const leftStyle = bookingIndex % 2 === 0 ? { left: '0.25rem', right: '50%' } : { left: '50%', right: '0.25rem' };
                                        return (
                                            <div
                                                key={booking.id}
                                                className="absolute mx-1 mt-2 rounded p-2 text-xs shadow text-white"
                                                style={{ top: `${top}px`, height: `${height}px`, backgroundColor: ["#FF8E9E", "#B6D8D1", "#FFB084", "#F4E7B3"][booking.service.id % 3], ...leftStyle }}
                                            >
                                                <div className="font-semibold">{booking.customer_name}</div>
                                                <div className="flex justify-between items-center">
                                                    <div >{formatTime(booking.booking_time)}</div>
                                                    <div className="text-nowrap">{booking.service.id === 3 ? "Haircut2" : booking.service?.title}</div>

                                                </div>
                                                <div>{booking.service.description}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md">
                    <div ref={ModalRef} className="bg-white p-6 rounded-xl w-96">
                        <h2 className="text-xl font-semibold mb-4 text-pri">Add New Booking</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                            <Input
                                type="text"
                                label="Customer Name"
                                {...register("customer_name", { required: "Customer name is required" })}
                                error={errors.customer_name?.message}
                            />

                            <Input
                                type="text"
                                label="Customer Phone"
                                {...register("customer_phone", {
                                    required: "Customer phone is required",
                                    pattern: { value: /^\+?\d{10,15}$/, message: "Invalid phone number (e.g., +1234567890)" }
                                })}
                                error={errors.customer_phone?.message}
                            />

                            <div className="mb-3">
                                <select
                                    {...register("service_id", { required: "Service is required" })}
                                    className="w-full p-2 border rounded border-pri text-pri font-semibold"
                                >
                                    <option value="">Select Service</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.title} ({service.duration} min)
                                        </option>
                                    ))}
                                </select>
                                {errors.service_id && <p className="text-red-500 text-xs mt-1">{errors.service_id.message}</p>}
                            </div>

                            <div className="mb-3">
                                <select
                                    {...register("employee_id", { required: "Employee is required" })}
                                    className="w-full p-2 border rounded border-pri text-pri font-semibold"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id.message}</p>}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="datetime-local"
                                    {...register("booking_time", { required: "Date and time are required" })}
                                    className="w-full p-2 border rounded border-pri text-pri font-semibold" border-pri text-pri font-semibold
                                />
                                {errors.booking_time && <p className="text-red-500 text-xs mt-1">{errors.booking_time.message}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;