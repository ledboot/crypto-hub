export function HeroImage() {
    return (
      <div className="relative w-full max-w-3xl mx-auto mt-8 md:mt-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 blur-xl"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-3 gap-2 p-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 h-24 flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  