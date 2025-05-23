import React from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

const navigation = [
    { name: 'Top Restaurants', href: '/', current: true },
    { name: 'Categories', href: '/categories', current: false },
    { name: 'Reviews', href: '/reviews', current: false },
    { name: 'About', href: '/about', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')

}

export default function NavBar({ user, setUser }) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const updatedNavigation = navigation.map(item => ({
        ...item,
        current: item.href === currentPath
    }));

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user')
        navigate("/login")
    };

    return (
        <Disclosure as="nav" className="bg-gray-800 w-full">
            <div className="w-full px-2 ">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link
                                to="/"
                                className='font-bold text-2xl text-white cursor-pointer'
                            >
                                Campus Eats
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {updatedNavigation.map((item) => (
                                    item.href.startsWith('/') ? (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/*}
                        <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="size-6" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    {user ? (
                                        <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <div className="size-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                {user ? (
                                    <>
                                        <MenuItem>
                                            <span
                                                className="block px-4 py-2 text-sm text-gray-700 font-semibold"
                                            >
                                                {user.name || user.email}
                                            </span>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Sign out
                                            </button>
                                        </MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem>
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Log In
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                to="/signup"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Sign Up
                                            </Link>
                                        </MenuItem>
                                    </>
                                )}
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {updatedNavigation.map((item) => (
                        item.href.startsWith('/') ? (
                            <Link
                                key={item.name}
                                to={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        )
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}

