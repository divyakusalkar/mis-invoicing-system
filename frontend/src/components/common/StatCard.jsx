const StatCard = ({ title, value, icon: Icon, gradient, trend }) => {
    return (
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:border-gray-600/50 hover:shadow-xl hover:shadow-indigo-500/5 group">
            {/* Background gradient */}
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`} />

            <div className="relative flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate">{title}</p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white truncate">{value}</p>
                    {trend && (
                        <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            <span className="hidden sm:inline"> from last month</span>
                        </p>
                    )}
                </div>
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-110 ml-2 flex-shrink-0`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
