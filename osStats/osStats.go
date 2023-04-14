package osStats

import (
	"fmt"
	"github.com/mackerelio/go-osstat/cpu"
	"github.com/mackerelio/go-osstat/memory"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"
	"math"
)

type DiskStats struct {
	Total, Used, Available float64
}

func GetDiskStats() DiskStats {
	out, err := exec.Command("df", "-h").Output()
	if err != nil {
		panic(err)
	}

	// Convert slice of bytes to string
	outStr := string(out)

	// Split output into lines
	lines := strings.Split(outStr, "\n")

	var total, used, available float64
	//fmt.Println(lines)
	for _, line := range lines {

		fields := regexp.MustCompile(`\s+`).Split(line, -1)
		if len(fields) != 6 {
			continue
		}

		// Parse values from the output
		filesystem := fields[0]
		isDisk, err := regexp.Match("/dev/sd*", []byte(filesystem))
		if err != nil {
			continue
		}
		if !isDisk {
			continue
		}
		sizeString := strings.Replace(fields[1], "G", "", 1)
		size, err := strconv.ParseFloat(sizeString, 64)
		if err != nil {
			continue
		}
		usedSize, err := strconv.ParseFloat(strings.Replace(fields[2], "G", "", 1), 64)
		if err != nil {
			continue
		}
		availableSize, err := strconv.ParseFloat(strings.Replace(fields[3], "G", "", 1), 64)
		if err != nil {
			continue
		}

		// Add values to the totals
		total += size
		used += usedSize
		available += availableSize

	}

	return DiskStats{
		Total:     total,
		Used:      used,
		Available: available,
	}
}

type CPUStats struct {
	UsagePercentage, CpuIdlePercentage float64
	CpuCount                           int
}

func GetCPUStats() CPUStats {
	before := getCPUStats()
	time.Sleep(time.Duration(1) * time.Second)
	after := getCPUStats()
	total := float64(after.Total - before.Total)

	cpuCount := before.CPUCount

	return CPUStats{
		UsagePercentage:   float64(after.User-before.User) * 100 / total,
		CpuIdlePercentage: float64(after.Idle-before.Idle) * 100 / total,
		CpuCount:          cpuCount}
}

type RAMStats struct {
	Total, Used, Available float64
}


func getCPUStats() *cpu.Stats {
	data, err := cpu.Get()
	if err != nil {
		fprintf, err := fmt.Fprintf(os.Stderr, "%s\n", err)
		if err != nil {
			panic(fprintf)
		}
	}
	return data
}

func GetRAMStats() RAMStats {
	stats := getRAMStats()
	time.Sleep(time.Duration(1) * time.Second)

	return RAMStats{
		Total: float64(stats.Total)/math.Pow(10, 9), 
		Used: float64(stats.Used)/math.Pow(10, 9), 
		Available: float64(stats.Free)/math.Pow(10, 9),
	}
}

func getRAMStats() *memory.Stats {
	data, err := memory.Get()
	if err != nil {
		fprintf, err := fmt.Fprintf(os.Stderr, "%s\n", err)
		if err != nil {
			panic(fprintf)
		}
	}
	return data
}



type Stats struct {
	CpuStats  CPUStats
	DiskStats DiskStats
	RamStats RAMStats
}

func GetStats() Stats {
	cpuStats := GetCPUStats()
	diskStats := GetDiskStats()
	ramStats := GetRAMStats()
	return Stats{CpuStats: cpuStats, DiskStats: diskStats, RamStats: ramStats}
}
