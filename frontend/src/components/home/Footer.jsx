function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* About */}
                <div className="space-y-4">
                    <h3 className="text-white text-lg font-bold">Academic Portal</h3>
                    <p className="text-sm leading-relaxed">
                        Empowering students and faculty with seamless access to quality academic resources and research materials.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h3 className="text-white text-lg font-bold">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">About the College</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Administration</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Admissions</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Research</li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="space-y-4">
                    <h3 className="text-white text-lg font-bold">Resources</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Departments</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Faculty Directory</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">Academic Calendar</li>
                        <li className="hover:text-blue-400 cursor-pointer transition-colors">E-Learning</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <h3 className="text-white text-lg font-bold">Contact Us</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Email: info@academicportal.edu</li>
                        <li>Phone: +1 (234) 567-890</li>
                        <li>Address: 123 University Ave, Education City</li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                <p>© 2026 Vellalar College for Women. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
