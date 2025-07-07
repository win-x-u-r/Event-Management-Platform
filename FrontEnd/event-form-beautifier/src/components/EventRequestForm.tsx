import React, { useEffect, useState } from "react";
import { apiService } from '@/services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Building2,
} from "lucide-react";
import { API_BASE_URL } from "@/config";
import { departmentAdmins } from "@/utils/userUtils";  // adjust path as needed

const normalizeDepartment = (dept: string): string =>
  dept.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
export default function EventRequestForm() {
  const [needsBudget, setNeedsBudget] = useState(false);
  const [items, setItems] = useState([
    { name: "", quantity: "", price: "", totalPrice: "" },
  ]);

  // Personal Information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  // Event Details
  const [eventName, setEventName] = useState(""); // Event Name
  const [host, setHost] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [expectedStudents, setExpectedStudents] = useState("");
  const [expectedFaculty, setExpectedFaculty] = useState("");
  const [expectedCommunity, setExpectedCommunity] = useState("");
  const [expectedOthers, setExpectedOthers] = useState("");
  const [totalExpected, setTotalExpected] = useState(0);

  // Classification
  const [category, setCategory] = useState("");
  const [targetAudience, setTargetAudience] = useState([]);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const sum =
      Number(expectedStudents) +
      Number(expectedFaculty) +
      Number(expectedCommunity) +
      Number(expectedOthers);
    setTotalExpected(sum);
  }, [expectedStudents, expectedFaculty, expectedCommunity, expectedOthers]);

  const handleTargetAudienceChange = (audience) => {
    setTargetAudience(prev => {
      if (prev.includes(audience)) {
        return prev.filter(item => item !== audience);
      } else {
        return [...prev, audience];
      }
    });
  };

  const handleGoalChange = (selectedGoal) => {
    setGoals(selectedGoal);
    if (selectedGoal !== "Other") {
      setCustomGoal("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    // Determine final goal value
    let finalGoal = goals;
    if (goals === "Other" && customGoal.trim()) {
      finalGoal = customGoal.trim();
    }

    const payload = {
      status: "Pending",
      name: eventName,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime + ":00",
      end_time: endTime + ":00",
      description,
      host,
      venue,
      location,
      category,
      department,
      goals: finalGoal,
      expected_students: parseInt(expectedStudents),
      expected_faculty: parseInt(expectedFaculty),
      expected_community: parseInt(expectedCommunity),
      expected_others: parseInt(expectedOthers),
      full_name: fullName,
      email,
      phone,
      target_audience: targetAudience.join(", "),
    };

    console.log("Submitting Event payload:", payload);

    try {
      const eventData = await apiService.createEvent(payload);
      const eventId = eventData.id;
      console.log("✅ Event created:", eventData);
      const normalizedDept = normalizeDepartment(department);
      console.log("🔍 Raw selected department:", department);
      console.log("✅ Normalized selected department:", normalizedDept);
      console.log("📬 All normalized department entries:");
      Object.entries(departmentAdmins).forEach(([email, dept]) => {
        console.log(` → ${email} → ${normalizeDepartment(dept)}`);
      });
      const chairEmail = Object.entries(departmentAdmins).find(
        ([, dept]) => normalizeDepartment(dept) === normalizedDept
      )?.[0];
      console.log("📣 Trying to notify chair of:", department, "Resolved email:", chairEmail);
      if (chairEmail) {
        try {
          await fetch(`${API_BASE_URL}/api/notify-chair/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: chairEmail,
              eventName: eventName,
              department,
              submittedBy: fullName,
              submittedEmail: email,
            }),
          });
          console.log("📧 Notification sent to:", chairEmail);
        } catch (notifyErr) {
          console.error("❌ Failed to notify chair:", notifyErr);
        }
      }

      for (const item of items) {
        if (
          item.name.trim() === "" &&
          item.quantity === "" &&
          item.price === "" &&
          item.totalPrice === ""
        ) continue;

        const budgetPayload = {
          item_name: item.name,
          item_quantity: parseInt(item.quantity),
          item_cost: parseFloat(item.price),
          total_cost: parseFloat(item.totalPrice),
          budget_status: "Pending",
          event: eventId,
        };

        await apiService.createBudget(budgetPayload);
      }

      setSuccessMessage("Event and Budget items submitted successfully!");
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("Submission failed. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: "", price: "", totalPrice: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const goalOptions = [
  "Connect students with potential employers through career-oriented opportunities",
  "Encourage knowledge sharing and expert dialogue on relevant topics",
  "Facilitate student employment opportunities and industry exposure",
  "Celebrate national pride and cultural identity",
  "Promote multicultural awareness and inclusion",
  "Foster patriotism and national unity",
  "Showcase academic research and stimulate scholarly exchange",
  "Support entrepreneurial mindset and innovative thinking",
  "Build bridges between academia and industry through thematic discussions",
  "Introduce graduate students to academic expectations and community",
  "Recognize academic and extracurricular excellence",
  "Celebrate milestones and community achievements",
  "Welcome new students and support their transition into university life",
  "Raise awareness on mental health and well-being",
  "Celebrate community and strengthen relationships",
  "Foster a sense of belonging during the holy month of Ramadan",
  "Reconnect with alumni and foster lifelong relationships",
  "Reward students and staff with social engagement activities",
  "Showcase the talents and achievements of graduating students",
  "Encourage student leadership and democratic engagement",
  "Promote understanding of academic integrity through interactive learning",
  "Develop public speaking and presentation skills",
  "Celebrate and empower women globally and locally",
  "Enhance student wellness and personal development",
  "Foster student creativity and team collaboration",
  "Develop technical design and engineering skills",
  "Engage alumni in networking and mentorship",
  "Evaluate student projects and provide academic feedback",
  "Guide project development with interim evaluations",
  "Assess final project deliverables and outcomes",
  "Display student creativity and academic accomplishments",
  "Strengthen ties with industry partners",
  "Encourage academic discourse and dissemination",
  "Promote a culture of research and innovation",
  "Foster industry-academic collaboration",
  "Support students in securing and reflecting on internships",
  "Build inter-university relationships and collaboration",
  "Enhance university engagement with the wider community",
  "Equip students with essential professional skills",
  "Build early engagement and awareness with prospective students",
  "Generate revenue through venue and facility use",
  "Promote physical activity and teamwork through sports",
  "Other"
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Event Request Form
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Submit your event proposal with all the necessary details for
            approval and coordination
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Personal Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  AURAK Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="your.email@aurak.ac.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+971 XX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Department *
                </label>
                <select
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  <option value="">Select your department</option>
                  {[
                    "Department of Computer Science and Engineering",
                    "Department of Architecture",
                    "Department of Chemical and Petroleum Engineering",
                    "Department of Civil and Infrastructure Engineering",
                    "Department of Electrical & Electronics Engineering",
                    "Department of Mechanical Engineering",
                    "Department of Biotechnology",
                    "Department of Humanities and Social Sciences",
                    "Department of Mathematics and Physics",
                    "Department of Accounting and Finance",
                    "Department of Management",
                  ].map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Event Details
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Event Name *
                  </label>
                  <input
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Host *
                  </label>
                  <input
                    required
                    placeholder="Event host/organizer"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Event Description *
                </label>
                <textarea
                  required
                  placeholder="Describe your event in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Event Goal *
                </label>
                <select
                  required
                  value={goals}
                  onChange={(e) => handleGoalChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  <option value="">Select event goal</option>
                  {goalOptions.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
                {goals === "Other" && (
                  <input
                    required
                    placeholder="Please specify your custom goal..."
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground mt-2"
                  />
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Event Venue *
                  </label>
                  <input
                    required
                    placeholder="Venue name"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Event Location *
                  </label>
                  <input
                    required
                    placeholder="Specific location/address"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Start Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      End Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time *
                    </label>
                    <input
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      type="time"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      End Time *
                    </label>
                    <input
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      type="time"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Expected Number of Student Attendees
                  </label>
                  <input
                    type="number"
                    value={expectedStudents}
                    onChange={(e) => setExpectedStudents(e.target.value)}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Expected Number of Faculty Attendees
                  </label>
                  <input
                    type="number"
                    value={expectedFaculty}
                    onChange={(e) => setExpectedFaculty(e.target.value)}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Expected Number of Community Attendees
                  </label>
                  <input
                    type="number"
                    value={expectedCommunity}
                    onChange={(e) => setExpectedCommunity(e.target.value)}
                    placeholder="e.g., 15"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Expected Number of Other Attendees
                  </label>
                  <input
                    type="number"
                    value={expectedOthers}
                    onChange={(e) => setExpectedOthers(e.target.value)}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              {/* Total Field */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-foreground">Total Expected Attendees</label>
                <input
                  type="number"
                  value={totalExpected}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-muted bg-muted/50 backdrop-blur-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Event Classification Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Event Classification
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Event Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Sport", "Academic", "Cultural", "Club", "Other"].map(
                    (cat) => (
                      <label
                        key={cat}
                        className={`flex items-center gap-3 p-3 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer ${
                          category === cat ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          required
                          value={cat}
                          checked={category === cat}
                          onChange={() => setCategory(cat)}
                          className="text-primary"
                        />
                        <span className="text-foreground">{cat}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Target Audience * (Select all that apply)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Students", "Faculty", "Community"].map((aud) => (
                    <label
                      key={aud}
                      className={`flex items-center gap-3 p-3 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer ${
                        targetAudience.includes(aud) ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={aud}
                        checked={targetAudience.includes(aud)}
                        onChange={() => handleTargetAudienceChange(aud)}
                        className="text-primary"
                      />
                      <span className="text-foreground">{aud}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Request Resources
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Food", "Beverages", "Screens", "Markers/Pens", "Papers"].map(
                  (item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 p-3 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer"
                    >
                      <input type="checkbox" className="text-primary" />
                      <span className="text-foreground">{item}</span>
                    </label>
                  )
                )}
              </div>
              <input
                placeholder="Other resources (specify)"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Budget Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Budget Request
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Do you need a budget? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      onChange={() => setNeedsBudget(true)}
                      className="text-primary"
                    />
                    <span className="text-foreground">Request Budget</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      onChange={() => setNeedsBudget(false)}
                      className="text-primary"
                    />
                    <span className="text-foreground">
                      No Budget
                    </span>
                  </label>
                </div>
              </div>

              {needsBudget && (
                <div className="space-y-6 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Budget Items
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="relative p-6 border border-border rounded-2xl bg-background/30 backdrop-blur-sm space-y-4"
                    >
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Item Name *
                          </label>
                          <input
                            required
                            placeholder={`Item ${index + 1} name`}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Quantity *
                          </label>
                          <input
                            required
                            type="number"
                            placeholder="Qty"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Unit Price (AED) *
                          </label>
                          <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.price}
                            onChange={(e) =>
                              handleItemChange(index, "price", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Total Price (AED) *
                          </label>
                          <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
                            value={item.totalPrice}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "totalPrice",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl transform
                ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-2xl hover:scale-105"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Event Request"}
            </button>
          </div>
        </form>
        {/* Success message goes below the form */}
        {successMessage && (
          <div className="text-green-600 font-bold mt-4 text-center">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}