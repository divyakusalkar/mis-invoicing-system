const StatCard = ({ title, value, icon: Icon, gradient, trend }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 transition-all duration-300 hover:border-gray-600/50 hover:shadow-xl hover:shadow-indigo-500/5 group">
            {/* Background gradient */}
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`} />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
