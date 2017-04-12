done = function(summary, latency, requests)
    filename = "stats.csv"
    statsfile = assert(io.open(filename, "a"))
    statsfile.write(statsfile, string.format("%.2f,", latency.min));
    statsfile.write(statsfile, string.format("%.2f,", latency.max));
    statsfile.write(statsfile, string.format("%.2f,", latency.mean));
    statsfile.write(statsfile, string.format("%.2f,", latency.stdev));
    statsfile.write(statsfile, string.format("%d,", summary.duration));
    statsfile.write(statsfile, string.format("%d,", summary.requests));
    statsfile.write(statsfile, string.format("%d,", summary.bytes));
    statsfile.write(statsfile, string.format("%.2f,", summary.requests / summary.duration * 1e6));
    statsfile.write(statsfile, string.format("%.2f\n", summary.bytes / summary.duration * 1e6));
    statsfile.close()
end
