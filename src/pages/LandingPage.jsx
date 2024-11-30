import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowRight, BookOpen, Library, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "@/components/Footer"
import { Skeleton } from "@/components/ui/skeleton"
import CustomAppBar from "@/components/CustomAppBar"

const LandingPage = () => {
  const [publishers, setPublishers] = useState([])
  const [randomBooks, setRandomBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publishersRes, booksRes] = await Promise.all([
          axios.get(`${backendUrl}/publishers/public/random`),
          axios.get(`${backendUrl}/ebook/public/random`)
        ])
        
        setPublishers(publishersRes.data)
        setRandomBooks(booksRes.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [backendUrl])

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      <CustomAppBar
        userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
        loginRoute="/user/login"
        homeRoute="/user/home"
        accountSettingRoute="/user/accountsetting"
        userType={1}
        isLandingPage={true}
      />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative bg-background pt-16 md:pt-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl mx-auto"
              >
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Books Shouldn't Be This Locked Down 🔒
                  </h1>
                  <p className="text-gray-500 md:text-xl dark:text-gray-400">
                    Connect with publishers, discover new books, and read anywhere. Join our growing community of readers and publishers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8">
                  <Button onClick={() => navigate("/user/login")} size="lg">
                    Log In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigate("/user/register")} variant="outline" size="lg">
                    Sign Up
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-3xl mx-auto"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
                  <div className="relative rounded-3xl border bg-background p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">Platform Features</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Everything you need to manage and read digital books
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-500" />
                        </div>
                        <h4 className="font-semibold">Digital Reading</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Read your books on any device, anywhere, anytime
                        </p>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Library className="h-6 w-6 text-purple-500" />
                        </div>
                        <h4 className="font-semibold">Publisher Network</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Access books from top publishers worldwide
                        </p>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Users className="h-6 w-6 text-green-500" />
                        </div>
                        <h4 className="font-semibold">No DRM</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Own your books and read them as you wish
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        <section className="py-16 px-4 md:px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Books</h2>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="w-full flex-shrink-0">
                    <div className="relative pt-[150%]">
                      <Skeleton className="absolute inset-0 rounded-t-lg" />
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {randomBooks.map((book) => (
                  <motion.div
                    key={book.eBookID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      className="w-full overflow-hidden cursor-pointer group"
                      onClick={() => navigate("/user/login")}
                    >
                      <div className="relative pt-[150%]">
                        <div className="absolute inset-0">
                          <img
                            src={book.cover ? `data:image/jpeg;base64,${book.cover}` : "/placeholder-cover.jpg"}
                            alt={book.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h3 className="text-sm font-semibold line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {book.author}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Publishers Section */}
        <section className="py-16 px-4 md:px-6 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Publishers</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {publishers.map((publisher) => (
                  <motion.div
                    key={publisher.publisherID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gray-100">
                          {publisher.avatar ? (
                            <img
                              src={`data:image/jpeg;base64,${publisher.avatar}`}
                              alt={publisher.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-2xl font-bold text-gray-400">
                                {publisher.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">{publisher.name}</h3>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
