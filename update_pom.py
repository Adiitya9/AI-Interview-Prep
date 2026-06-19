with open('/Users/adityamacbook/Documents/Resume Project/backend/pom.xml', 'r') as f:
    pom = f.read()

plugin = """
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
"""

pom = pom.replace('<plugins>', '<plugins>' + plugin)

with open('/Users/adityamacbook/Documents/Resume Project/backend/pom.xml', 'w') as f:
    f.write(pom)
