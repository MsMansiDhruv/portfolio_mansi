import {
  SiTerraform, SiDocker,
  SiAwslambda, SiAmazons3, SiAwsorganizations, SiAmazonredshift, SiApachekafka, SiAmazonwebservices,
  SiAmazondynamodb, SiAmazonecs, SiKubernetes, SiGooglecloud,
  SiGraphql, SiFastapi, SiDjango, SiFlask,
  SiPostgresql, SiMysql, SiMongodb, SiRedis, SiElasticsearch, SiSqlite,
  SiApachehadoop, SiApacheflink,
  SiConcourse, SiJenkins, SiGithubactions,
  SiApacheairflow, SiPython, SiGnubash,
  SiPandas, SiJupyter, SiScikitlearn, SiApachespark, SiMlflow, SiNumpy
} from 'react-icons/si';

export default function SystemOverview({ isDay }) {

  const itemsBase =
    "flex items-center gap-2 p-2 rounded transition-all border";

  const bgCert = isDay
    ? "bg-white/70 border-slate-200 text-slate-800"
    : "bg-slate-900 border-slate-700 text-slate-300";

  const bgTool = isDay
    ? "bg-white/60 border-slate-200 hover:bg-white/80"
    : "bg-slate-900 border-slate-700 hover:bg-slate-800";

  const iconColor = isDay
    ? "text-primary"
    : "text-primary";

  return (
    <div className="space-y-6">

      {/* CERTIFICATIONS */}
      <div>
        <h4 className={`font-semibold mb-2 ${isDay ? "text-slate-800" : "text-slate-200"}`}>
          Certifications
        </h4>

        <ul className="flex flex-col gap-1">
          {[
            { label: "AWS Certified Cloud Practitioner (CLF)", icon: SiAmazonwebservices },
            { label: "SQL for Data Analysis and Data Science", icon: SiMysql },
            { label: "Big Data Analytics using Spark", icon: SiApachespark },
            { label: "Docker Essentials", icon: SiDocker },
            { label: "Terraform Associate Certification", icon: SiTerraform },
          ].map(({ label, icon: IconComponent }) => (
            <li
              key={label}
              className={`${itemsBase} ${bgCert}`}
              title={label}
            >
              <IconComponent className={`w-5 h-5 ${iconColor}`} />
              <span className="text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* SKILLS GRID */}
      <div>
        <h4 className={`font-semibold mb-2 ${isDay ? "text-slate-800" : "text-slate-200"}`}>
          Skills & Tools
        </h4>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(40px,1fr))] gap-1.5">
          {[
            { label: "Terraform", icon: SiTerraform },
            { label: "Docker", icon: SiDocker },

            { label: "AWS Lambda", icon: SiAwslambda },
            { label: "Amazon S3", icon: SiAmazons3 },
            { label: "AWS Organizations", icon: SiAwsorganizations },
            { label: "Amazon Redshift", icon: SiAmazonredshift },
            { label: "Apache Kafka", icon: SiApachekafka },
            { label: "Amazon Web Services", icon: SiAmazonwebservices },
            { label: "Amazon DynamoDB", icon: SiAmazondynamodb },
            { label: "Amazon ECS", icon: SiAmazonecs },
            { label: "Kubernetes", icon: SiKubernetes },
            { label: "Google Cloud", icon: SiGooglecloud },

            { label: "GraphQL", icon: SiGraphql },
            { label: "FastAPI", icon: SiFastapi },
            { label: "Django", icon: SiDjango },
            { label: "Flask", icon: SiFlask },

            { label: "PostgreSQL", icon: SiPostgresql },
            { label: "MySQL", icon: SiMysql },
            { label: "MongoDB", icon: SiMongodb },
            { label: "Redis", icon: SiRedis },
            { label: "Elasticsearch", icon: SiElasticsearch },
            { label: "SQLite", icon: SiSqlite },

            { label: "Apache Hadoop", icon: SiApachehadoop },
            { label: "Apache Flink", icon: SiApacheflink },

            { label: "Concourse", icon: SiConcourse },
            { label: "Jenkins", icon: SiJenkins },
            { label: "GitHub Actions", icon: SiGithubactions },

            { label: "Apache Airflow", icon: SiApacheairflow },
            { label: "Python", icon: SiPython },
            { label: "GNU Bash", icon: SiGnubash },

            { label: "Pandas", icon: SiPandas },
            { label: "Jupyter", icon: SiJupyter },
            { label: "Scikit-learn", icon: SiScikitlearn },
            { label: "Apache Spark", icon: SiApachespark },
            { label: "MLflow", icon: SiMlflow },
            { label: "NumPy", icon: SiNumpy },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className={`${itemsBase} ${bgTool} flex items-center justify-center`}
              title={label}
            >
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
