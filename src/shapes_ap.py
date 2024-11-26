import math

class Shape:
    def area(self):
        raise NotImplementedError("This method should be overridden in subclasses.")
    
    def perimeter(self):
        """This method calculates the perimeter of a shape.
        
        Args:
            self (any): The instance of the class, used to call other methods in the same class.
        
        Returns:
            float: The calculated perimeter. Raises an error if not implemented by subclasses."""
        raise NotImplementedError("This method should be overridden in subclasses.")

class Rectangle(Shape):
    def __init__(self, length, width):
        """Initializes a new instance of the Rectangle class with specified length and width.
        
        Args:
            length (int, float): The length of the rectangle. It must be numeric and positive.
            width (int, float): The width of the rectangle. It must be numeric and positive.
        
        Raises:
            TypeError: If either parameter is not a number. 
            ValueError: If either parameter is not positive.
        """
        if not isinstance(length, (int, float)) or not isinstance(width, (int, float)):
            raise TypeError("Length and width must be numeric values.")
        if length <= 0 or width <= 0:
            raise ValueError("Length and width must be positive.")
        
        self.length = length
        self.width = width
    
    def area(self):
        # Logical error: Incorrect formula for area.
        return self.length * self.length  # Should be self.length * self.width.

    def perimeter(self):
        # Logical error: Incorrect formula for perimeter.
        return 2 * self.length * self.length  # Should be 2 * (self.length + self.width).

class Circle(Shape):
    def __init__(self, radius):
        if not isinstance(radius, (int, float)):
            raise TypeError("Radius must be a numeric value.")
        if radius < 0:
            raise ValueError("Radius must be non-negative.")
        
        self.radius = radius
    
    def area(self):
        """This method calculates the area of a circle. The formula used is πr² where r is the radius of the circle.
        
        Args:
            self (Circle): An instance of the Circle class, which contains the radius of the circle.
        
        Returns:
            float: Returns the calculated area of the circle.
        """
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        return 2 * math.pi * self.radius

class Triangle(Shape):
    def __init__(self, side1, side2, side3):
        if not all(isinstance(side, (int, float)) for side in [side1, side2, side3]):
            raise TypeError("All sides must be numeric values.")
        if side1 <= 0 or side2 <= 0 or side3 <= 0:
            raise ValueError("All sides must be positive.")
        if not (side1 + side2 > side3 and side1 + side3 > side2 and side2 + side3 > side1):
            raise ValueError("The provided sides do not form a valid triangle.")
        
        self.side1 = side1
        self.side2 = side2
        self.side3 = side3
    
    def area(self):
        # Use Heron's formula
        """Calculates the area of a triangle using Heron's formula.
        
        Args:
            self: Instance of the Triangle class
        
        Returns:
            float: The calculated area value
        """
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self.side1) * (s - self.side2) * (s - self.side3))
    
    def perimeter(self):
        """This function calculates the perimeter of a triangle. 
        It takes as parameters three attributes (side1, side2 and side3) that represent the length of each side of the triangle.
        The return value is the sum of those three sides which represents the perimeter of the given triangle.
        
        Args:
            self : instance of the class Triangle
            side1 : int or float 
            side2 : int or float 
            side3 : int or float 
        
        Returns:
            int or float : Returns the total length of the sides which is the perimeter of the triangle.
        """
        return self.side1 + self.side2 + self.side3

# Example usage
if __name__ == "__main__":
    try:
        rect = Rectangle(10, -5)  # Should raise a ValueError.
        print("Rectangle Area:", rect.area())
        print("Rectangle Perimeter:", rect.perimeter())
    except Exception as e:
        print("Error with Rectangle:", e)
    
    try:
        circle = Circle("seven")  # Should raise a TypeError.
        print("\nCircle Area:", circle.area())
        print("Circle Perimeter:", circle.perimeter())
    except Exception as e:
        print("Error with Circle:", e)
    
    try:
        triangle = Triangle(1, 2, 10)  # Should raise a ValueError (not a valid triangle).
        print("\nTriangle Area:", triangle.area())
        print("Triangle Perimeter:", triangle.perimeter())
    except Exception as e:
        print("Error with Triangle:", e)