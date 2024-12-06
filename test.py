

# t: [3, 8, 4, 1]
# => [[3], [8], [4], [1], [3, 8], [3, 4], [3, 1], [8, 4], [8, 1], [3, 8, 4], [8, 4, 1], [3, 8, 1], [3, 4, 1]]

def calculateAllTheCombinations(t):
    def combinations(current, remaining):
        if remaining:
            combinations(current + [remaining[0]], remaining[1:])
            combinations(current, remaining[1:])
        elif current:
            b_result.append(current)
    b_result = []
    combinations([], t)
    f_result = []
    for x in b_result:
        n = 0
        for i in range(len(x)):
            n += x[i]
        f_result.append(n)
    return f_result

t = [3, 8, 4, 1]
print(calculateAllTheCombinations(t))